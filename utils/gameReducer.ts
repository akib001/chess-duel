import { initialChessBoard } from "./constants";
import { GameStatus, Piece, PlayerTypes, actionTypes } from "./enums";
import {
  checkMove,
  findKingPosition,
  isCheckmate,
  isKingInCheck,
  isOpponentPiece,
  isPlayerPiece,
  oppositePlayer,
} from "./helpers";

interface MoveHistory {
  movedLocation: number;
  board: Array<Piece>;
  isKingInCheck: boolean;
}

interface GameState {
  board: Array<Piece>;
  currentPlayer: PlayerTypes;
  selectedLocation: number | null;
  gameHistory: Array<MoveHistory>;
  capturedPieces: Array<Piece>;
  status: GameStatus;
}

export const initialState: GameState = {
  board: initialChessBoard,
  currentPlayer: PlayerTypes.WHITE,
  selectedLocation: null,
  gameHistory: [],
  capturedPieces: [],
  status: GameStatus.ONGOING,
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
      const { board, selectedLocation, currentPlayer, status } = state;

      if (status !== GameStatus.ONGOING) {
        return { ...state };
      }

      const targetLocation = action.payload;

      const deSelectInitialState = { ...state, selectedLocation: null };

      if (selectedLocation == null || action.payload == null) {
        return deSelectInitialState;
      }

      const selectedPiece = board[selectedLocation];
      const toPiece = board[action.payload];

      // out of board
      if (targetLocation < 0 || targetLocation > 63) {
        return deSelectInitialState;
      }

      // can not capture king piece
      if (toPiece == Piece.BLACK_KING || toPiece == Piece.WHITE_KING) {
        return deSelectInitialState;
      }

      // can not move more than 1 step
      if (isOpponentPiece(currentPlayer, selectedPiece)) {
        return deSelectInitialState;
      }

      // can not capture own piece
      if (isPlayerPiece(currentPlayer, toPiece)) {
        return deSelectInitialState;
      }

      const isTryingToCapture = toPiece > 0;

      let capturedPiece = null;

      const copiedBoard = [...board];

      if (checkMove(selectedLocation, targetLocation, currentPlayer, board)) {
        if (isTryingToCapture) {
          capturedPiece = board[targetLocation];
        }
        copiedBoard[selectedLocation] = Piece.EMPTY;
        copiedBoard[targetLocation] = selectedPiece;

        // king checkmate check
        const kingPosition = findKingPosition(copiedBoard, currentPlayer);

        if (isKingInCheck(copiedBoard, kingPosition, currentPlayer)) {
          console.log("king will be in check");
          return { ...state, selectedLocation: null };
        }

        // history save

        const copiedHistory = [...state.gameHistory];
        copiedHistory.push({
          movedLocation: targetLocation,
          board: [...copiedBoard],
          isKingInCheck: false,
        });

        const copiedCapturedPieces = [...state.capturedPieces];

        if (capturedPiece) {
          copiedCapturedPieces.push(capturedPiece);
        }

        if (isCheckmate(copiedBoard, oppositePlayer(currentPlayer))) {
          console.log("checkmate");
          return {
            ...state,
            board: copiedBoard,
            selectedLocation: null,
            gameHistory: copiedHistory,
            capturedPieces: copiedCapturedPieces,
            status: GameStatus.CHECKMATE,
          };
        }

        return {
          ...state,
          board: copiedBoard,
          selectedLocation: null,
          currentPlayer: oppositePlayer(currentPlayer),
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
