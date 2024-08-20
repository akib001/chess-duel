import { GameState } from "./common.interface";
import { DEFAULT_10_MIN, initialChessBoard } from "./constants";
import {
  GameMode,
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
  capturedPieces: [],
  status: GameStatus.ONGOING,
  whiteTimer: DEFAULT_10_MIN,
  blackTimer: DEFAULT_10_MIN,
  isPaused: true,
  result: GameResult.ONGOING,
  gameMode: GameMode.TIMED_PLAYER_VS_PLAYER,
};

export default function gameReducer(state = initialState, action: any) : GameState {
  switch (action.type) {
    case actionTypes.SELECT_PIECE: {
      return {
        ...state,
        selectedLocation: action.payload,
      };
    }
    case actionTypes.MOVE_PIECE: {
      const { board, currentPlayer, status, gameHistories } = state;

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

        const copiedHistories = gameHistories.map((history) => ({
          ...history,
        }));

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
          copiedHistories[copiedHistories?.length - 1].isCheckmate = true;

          return {
            ...state,
            board: copiedBoard,
            selectedLocation: null,
            gameHistories: copiedHistories,
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
      const copiedHistories = gameHistories.map((history) => ({ ...history }));
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
      const gameMode = action.payload;

      return {
        ...initialState,
        blackTimer: gameMode == GameMode.PLAYER_VS_PLAYER ? 0 : DEFAULT_10_MIN,
        whiteTimer: gameMode == GameMode.PLAYER_VS_PLAYER ? 0 : DEFAULT_10_MIN,
        gameMode: gameMode,
        isPaused: false,
      };
    }
    case actionTypes.PAWN_PROMOTION: {
      const pieceKey = action.payload;

      const { gameHistories, board } = state;
      const copiedHistories = gameHistories.map((history) => ({ ...history }));
      const lastMove = copiedHistories[copiedHistories.length - 1];
      lastMove.isPromotion = true;
      lastMove.promotedTo = pieceKey;
      const copiedBoard = [...board];
      copiedBoard[lastMove.to] = pieceKey;
      lastMove.board = copiedBoard;

      return {
        ...state,
        board: copiedBoard,
        gameHistories: copiedHistories,
      };
    }
    default:
      return state;
  }
}
