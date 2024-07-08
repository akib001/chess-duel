import { GameState } from "./common.interface";
import { initialChessBoard } from "./constants";
import { GameStatus, PieceTypes, PlayerTypes, actionTypes } from "./enums";
import {
  checkMove,
  findKingPosition,
  isCheckmate,
  isKingInCheck,
  isOpponentPiece,
  isPlayerPiece,
  oppositePlayer,
} from "./helpers";

export const initialState: GameState = {
  board: initialChessBoard,
  currentPlayer: PlayerTypes.WHITE,
  selectedLocation: null,
  gameHistories: [],
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
      const { board, currentPlayer, status } = state;

      if (status !== GameStatus.ONGOING) {
        return { ...state };
      }

      const { startIndex: selectedLocation, endIndex: targetLocation } =
        action.payload;

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
      if (
        toPiece == PieceTypes.BLACK_KING ||
        toPiece == PieceTypes.WHITE_KING
      ) {
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
        copiedBoard[selectedLocation] = PieceTypes.EMPTY;
        copiedBoard[targetLocation] = selectedPiece;

        // king checkmate check
        const kingPosition = findKingPosition(copiedBoard, currentPlayer);

        if (isKingInCheck(copiedBoard, kingPosition, currentPlayer)) {
          console.log("king will be in check");
          return { ...state, selectedLocation: null };
        }

        // history save

        const oppositePlayerKingPosition = findKingPosition(
          copiedBoard,
          oppositePlayer(currentPlayer)
        );
        const isCheck = isKingInCheck(
          copiedBoard,
          oppositePlayerKingPosition,
          oppositePlayer(currentPlayer)
        );

        const copiedHistories = [...state.gameHistories];
        // TODO: castling, promotion implement later
        copiedHistories.push({
          from: selectedLocation,
          to: targetLocation,
          piece: selectedPiece,
          capturedPiece: capturedPiece,
          isCheck: isCheck,
          isCheckmate: false,
          isCastling: false,
          isPromotion: false,
          promotedTo: undefined,
          board: [...copiedBoard],
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
            gameHistories: { ...copiedHistories, isCheckmate: true },
            capturedPieces: copiedCapturedPieces,
            status: GameStatus.CHECKMATE,
          };
        }

        return {
          ...state,
          board: copiedBoard,
          selectedLocation: null,
          currentPlayer: oppositePlayer(currentPlayer),
          gameHistories: copiedHistories,
          capturedPieces: copiedCapturedPieces,
        };
      }

      return { ...state, selectedLocation: null };
    }
    case actionTypes.UNDO_MOVE: {
      const { gameHistories } = state;
      if (gameHistories.length < 2) {
        return initialState;
      }

      const lastMove = gameHistories[gameHistories.length - 2];
      const copiedBoard = [...lastMove.board];
      const copiedHistories = [...gameHistories];
      copiedHistories.pop();

      return {
        ...state,
        board: copiedBoard,
        gameHistories: copiedHistories,
        currentPlayer: oppositePlayer(state.currentPlayer),
      };
    }
    default:
      return state;
  }
}
