import { initialChessBoard } from "./constants";
import { Piece, PlayerTypes, actionTypes } from "./enums";
import { checkMove } from "./helpers";

export const initialState = {
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

      let capturedPiece;

      const copiedBoard = [...board];

      if (
        checkMove(
          selectedLocation,
          targetLocation,
          currentPlayer,
          isTryingToCapture,
          board
        )
      ) {
        if (isTryingToCapture) {
          capturedPiece = board[targetLocation];
        }
        copiedBoard[selectedLocation] = Piece.EMPTY;
        copiedBoard[targetLocation] = selectedPiece;

        return {
          ...state,
          board: copiedBoard,
          selectedLocation: null,
          currentPlayer:
            currentPlayer === PlayerTypes.WHITE
              ? PlayerTypes.BLACK
              : PlayerTypes.WHITE,
        };
      }

      return { ...state, selectedLocation: null };
    }
    default:
      return state;
  }
}
