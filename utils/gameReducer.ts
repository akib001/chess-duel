import { initialChessBoard } from "./constants";
import { Piece, PlayerTypes, actionTypes } from "./enums";
import { checkMove } from "./helpers";

interface MoveHistory {
  from: number;
  to: number;
  player: PlayerTypes;
  capturedPiece: Piece | null;
}

interface GameState {
  board: Array<Piece>;
  currentPlayer: PlayerTypes;
  selectedLocation: number | null;
  gameHistory: Array<MoveHistory>;
  capturedPieces: Array<Piece>;
}

export const initialState: GameState = {
  board: initialChessBoard,
  currentPlayer: PlayerTypes.WHITE,
  selectedLocation: null,
  gameHistory: [],
  capturedPieces: [],
};

export default function gameReducer(state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SELECT_PIECE: {
      return {
        ...state,
        selectedLocation: action.payload,
      };
    }
    case actionTypes.MOVE_PIECE: {
      const { board, selectedLocation, currentPlayer } = state;

      const targetLocation = action.payload;

      if (selectedLocation == null || action.payload == null) {
        return { ...state, selectedLocation: null };
      }

      const selectedPiece = board[selectedLocation];
      const toPiece = board[action.payload];

      // out of board
      if (targetLocation < 0 || targetLocation > 63) {
        return { ...state, selectedLocation: null };
      }

      // can not move more than 1 step
      if (
        currentPlayer == PlayerTypes.BLACK
          ? selectedPiece > 0 && selectedPiece < 7
          : selectedPiece > 6
      ) {
        return { ...state, selectedLocation: null };
      }

      // can not capture own piece
      if (
        currentPlayer == PlayerTypes.WHITE
          ? toPiece > 0 && toPiece < 7
          : toPiece > 6
      ) {
        return { ...state, selectedLocation: null };
      }

      const isTryingToCapture = toPiece > 0;

      let capturedPiece = null;

      const copiedBoard = [...board];

      if (
        checkMove(
          selectedLocation,
          targetLocation,
          currentPlayer,
          board
        )
      ) {
        if (isTryingToCapture) {
          capturedPiece = board[targetLocation];
        }
        copiedBoard[selectedLocation] = Piece.EMPTY;
        copiedBoard[targetLocation] = selectedPiece;

        // king checkmate check
        let opponentPiecesIndexes: Array<Piece> = [];
        let targetKingIndex = -1;

        copiedBoard?.forEach((piece, index) => {
          if (
            currentPlayer === PlayerTypes.WHITE
              ? piece > 6
              : piece > 0 && piece < 7
          ) {
            opponentPiecesIndexes.push(index);
          } else if (piece == Piece.BLACK_KING || piece == Piece.WHITE_KING) {
            targetKingIndex = index;
          }
        });

        console.log("opponentPiecesIndexes", opponentPiecesIndexes);
        console.log("targetKingIndex", targetKingIndex);


        const isCheckmate = opponentPiecesIndexes.some((index) => {
          return checkMove(
            index,
            targetKingIndex,
            currentPlayer == PlayerTypes.WHITE
              ? PlayerTypes.BLACK
              : PlayerTypes.WHITE,
            copiedBoard
          );
        });

        console.log("isCheckmate", isCheckmate);

        if (isCheckmate) {
          console.log("Checkmate");
          return { ...state, selectedLocation: null };
        }

        // history save

        const copiedHistory = [...state.gameHistory];
        copiedHistory.push({
          from: selectedLocation,
          to: targetLocation,
          player: currentPlayer,
          capturedPiece: capturedPiece,
        });

        const copiedCapturedPieces = [...state.capturedPieces];

        if (capturedPiece) {
          copiedCapturedPieces.push(capturedPiece);
        }

        return {
          ...state,
          board: copiedBoard,
          selectedLocation: null,
          currentPlayer:
            currentPlayer === PlayerTypes.WHITE
              ? PlayerTypes.BLACK
              : PlayerTypes.WHITE,
          gameHistory: copiedHistory,
          capturedPieces: copiedCapturedPieces,
        };
      }

      return { ...state, selectedLocation: null };
    }
    default:
      return state;
  }
}