export enum PieceTypes {
  EMPTY = 0,
  WHITE_PAWN = 1,
  WHITE_KNIGHT = 2,
  WHITE_BISHOP = 3,
  WHITE_ROOK = 4,
  WHITE_QUEEN = 5,
  WHITE_KING = 6,
  BLACK_PAWN = 7,
  BLACK_KNIGHT = 8,
  BLACK_BISHOP = 9,
  BLACK_ROOK = 10,
  BLACK_QUEEN = 11,
  BLACK_KING = 12,
}

export enum PlayerTypes {
  WHITE = 0,
  BLACK = 1,
}

export enum actionTypes {
  SELECT_PIECE = "SELECT_PIECE",
  MOVE_PIECE = "MOVE_PIECE",
  UNDO_MOVE = "UNDO_MOVE",
  TIME_UP = "TIME_UP",
  TOGGLE_PAUSE = "TOGGLE_PAUSE",
  RESET = "RESET",
}

export enum GameStatus {
  ONGOING = "ONGOING",
  CHECK = "CHECK",
  CHECKMATE = "CHECKMATE",
  STALEMATE = "STALEMATE",
  TIMEOUT = "TIMEOUT",
}

export enum GameResult {
  ONGOING = "ONGOING",
  WHITE_WINS = "WHITE_WINS",
  BLACK_WINS = "BLACK_WINS",
  DRAW = "DRAW",
}
