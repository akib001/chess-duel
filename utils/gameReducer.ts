import { GameState } from "./common.interface";
import { DEFAULT_10_MIN, initialChessBoard } from "./constants";
import {
  GameResult,
  GameStatus,
  PieceTypes,
  PlayerTypes,
  actionTypes,
} from "./enums";
import {
  checkMove,
  findKingPosition,
  getResult,
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
  capturedPieces: [
    PieceTypes.WHITE_KNIGHT,
    PieceTypes.WHITE_BISHOP,
    PieceTypes.WHITE_QUEEN,
  ],
  status: GameStatus.ONGOING,
  whiteTimer: DEFAULT_10_MIN,
  blackTimer: DEFAULT_10_MIN,
  isPaused: true,
  result: GameResult.ONGOING,
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

      if (
        status == GameStatus.CHECKMATE ||
        status == GameStatus.TIMEOUT ||
        status == GameStatus.STALEMATE
      ) {
        console.log("game is not ongoing anymore");
        return { ...state };
      }

      const { startIndex: selectedLocation, endIndex: targetLocation } =
        action.payload;

      const deSelectInitialState = { ...state, selectedLocation: null };

      if (selectedLocation == null || action.payload == null) {
        return deSelectInitialState;
      }

      const selectedPiece = board[selectedLocation];
      const toPiece = board[targetLocation];

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
          capturedPiece = toPiece;
        }
        copiedBoard[selectedLocation] = PieceTypes.EMPTY;
        copiedBoard[targetLocation] = selectedPiece;

        // king checkmate check
        const kingPosition = findKingPosition(copiedBoard, currentPlayer);

        if (isKingInCheck(copiedBoard, kingPosition, currentPlayer)) {
          console.log("king will be in check");
          return { ...state, selectedLocation: null };
        }

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
            result:
              currentPlayer === PlayerTypes.WHITE
                ? GameResult.WHITE_WINS
                : GameResult.BLACK_WINS,

            //TODO: get result function refactor
          };
        }

        return {
          ...state,
          board: copiedBoard,
          selectedLocation: null,
          currentPlayer: oppositePlayer(currentPlayer),
          gameHistories: copiedHistories,
          capturedPieces: copiedCapturedPieces,
          status: isCheck ? GameStatus.CHECK : GameStatus.ONGOING,
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
    case actionTypes.TIME_UP: {
      const { currentPlayer } = state;
      return {
        ...state,
        status: GameStatus.TIMEOUT,
        result: getResult(currentPlayer),
      };
    }
    case actionTypes.TOGGLE_PAUSE: {
      return {
        ...state,
        isPaused: !state.isPaused,
      };
    }
    case actionTypes.RESET: {
      return { ...initialState, isPaused: false };
    }
    default:
      return state;
  }
}
