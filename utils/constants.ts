import { PieceTypes } from "./enums";

export const initialChessBoard: PieceTypes[] = [
  PieceTypes.BLACK_ROOK,
  PieceTypes.BLACK_KNIGHT,
  PieceTypes.BLACK_BISHOP,
  PieceTypes.BLACK_QUEEN,
  PieceTypes.BLACK_KING,
  PieceTypes.BLACK_BISHOP,
  PieceTypes.BLACK_KNIGHT,
  PieceTypes.BLACK_ROOK,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.BLACK_PAWN,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.EMPTY,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_PAWN,
  PieceTypes.WHITE_ROOK,
  PieceTypes.WHITE_KNIGHT,
  PieceTypes.WHITE_BISHOP,
  PieceTypes.WHITE_QUEEN,
  PieceTypes.WHITE_KING,
  PieceTypes.WHITE_BISHOP,
  PieceTypes.WHITE_KNIGHT,
  PieceTypes.WHITE_ROOK,
];

export const PIECE_IMAGES = {
  [PieceTypes.WHITE_PAWN]:
    "https://assets-themes.chess.com/image/ejgfv/150/wp.png",
  [PieceTypes.WHITE_KNIGHT]:
    "https://assets-themes.chess.com/image/ejgfv/150/wn.png",
  [PieceTypes.WHITE_ROOK]:
    "https://assets-themes.chess.com/image/ejgfv/150/wr.png",
  [PieceTypes.WHITE_BISHOP]:
    "https://assets-themes.chess.com/image/ejgfv/150/wb.png",
  [PieceTypes.WHITE_QUEEN]:
    "https://assets-themes.chess.com/image/ejgfv/150/wq.png",
  [PieceTypes.WHITE_KING]:
    "https://assets-themes.chess.com/image/ejgfv/150/wk.png",
  [PieceTypes.BLACK_PAWN]:
    "https://assets-themes.chess.com/image/ejgfv/150/bp.png",
  [PieceTypes.BLACK_KNIGHT]:
    "https://assets-themes.chess.com/image/ejgfv/150/bn.png",
  [PieceTypes.BLACK_ROOK]:
    "https://assets-themes.chess.com/image/ejgfv/150/br.png",
  [PieceTypes.BLACK_BISHOP]:
    "https://assets-themes.chess.com/image/ejgfv/150/bb.png",
  [PieceTypes.BLACK_QUEEN]:
    "https://assets-themes.chess.com/image/ejgfv/150/bq.png",
  [PieceTypes.BLACK_KING]:
    "https://assets-themes.chess.com/image/ejgfv/150/bk.png",
};

export const SQUARE_HORIZONTAL_LABEL: Record<number, string> = {
  56: "a",
  57: "b",
  58: "c",
  59: "d",
  60: "e",
  61: "f",
  62: "g",
  63: "h",
};

export const SQUARE_VERTICAL_LABEL: Record<number, string> = {
  0: "6",
  8: "5",
  16: "4",
  24: "5",
  32: "3",
  40: "2",
  48: "1",
  56: "0",
};

export const DEFAULT_10_MIN = 600;
