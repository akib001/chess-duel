import { GameMode, GameResult, GameStatus, PieceTypes, PlayerTypes } from "./enums";

export interface GameHistory {
  from: number;
  to: number;
  piece: PieceTypes;
  capturedPiece: PieceTypes | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isCastling: boolean;
  isPromotion: boolean;
  promotedTo?: PieceTypes;
  board: Array<PieceTypes>;
}

export interface GameState {
  board: Array<PieceTypes>;
  currentPlayer: PlayerTypes;
  selectedLocation: number | null;
  gameHistories: GameHistory[];
  capturedPieces: Array<PieceTypes>;
  status: GameStatus;
  whiteTimer: number;
  blackTimer: number;
  isPaused: boolean;
  result: GameResult;
  gameMode: GameMode;
}

interface playerNotation {
  notation: string;
  historyIndex: number;
}

export interface GameNotation {
  serial: number;
  white: playerNotation;
  black: playerNotation;
}
