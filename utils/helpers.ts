import { Piece, PlayerTypes } from "./enums";

const checkPawnMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  playerType: PlayerTypes,
  isTryingToCapture = false,
  board: Array<Piece>
) => {
  const multi = playerType == PlayerTypes.WHITE ? 1 : -1;

  let rowDiff = multi * (startRow - endRow);
  let colDiff = Math.abs(startCol - endCol);

  if (isTryingToCapture && colDiff == 1 && rowDiff == 1) {
    return true;
  } else if (colDiff > 0) {
    console.log("can not go horizontal");
    return false;
  } else {
    if (rowDiff < 0) {
      console.log("can not go backward");
      return false;
    }
    // 1st time
    if (startRow == 1 || startRow == 6) {
      // overlapping another piece
      if (rowDiff > 2) {
        return false;
      } else if (board[(startRow + multi * -1) * 8 + startCol]) {
        console.log("another piece exist in the path");
        return false;
      }
    } else {
      if (rowDiff > 1) {
        return false;
      }
    }
  }

  return true;
};

const checkRookMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  board: Array<Piece>
) => {
  if (startRow !== endRow && startCol !== endCol) {
    console.log("trying to go invalid path");
    return false;
  }

  let tempRow = startRow;
  let tempCol = startCol;

  while (tempRow != endRow && tempCol != endCol) {
    if (board[tempRow * 8 + tempCol]) {
      console.log("overlap with own or other piece");
      return false;
    }

    if (startRow !== endRow) {
      tempRow++;
    } else {
      tempCol++;
    }
  }

  return true;
};

const KNIGHT_MOVES = [
  [-2, -1],
  [2, 1],
  [-2, 1],
  [2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];

const checkKnightMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) => {
  for (const [row, col] of KNIGHT_MOVES) {
    if (startRow + row == endRow && startCol + col == endCol) {
      return true;
    }
  }

  return false;
};

const BISHOP_MOVES = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const checkBishopMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  board: Array<Piece>
) => {
  for (const [row, col] of BISHOP_MOVES) {
    let tempRow = startRow;
    let tempCol = startCol;

    while (true) {
      tempRow = tempRow + row;
      tempCol = tempCol + col;

      // out bound
      if (tempRow < 0 || tempRow > 7 || tempCol < 0 || tempCol > 7) {
        break;
      }

      if (tempRow == endRow && tempCol == endCol) {
        return true;
      }

      if (board[tempRow * 8 + tempCol]) {
        break;
      }
    }
  }

  console.log("could not found any matching end");

  return false;
};

const QUEEN_MOVIES = [...BISHOP_MOVES, [1, 0], [0, 1], [-1, 0], [0, -1]];

const checkQueenMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  board: Array<Piece>
) => {
  for (const [row, col] of QUEEN_MOVIES) {
    let tempRow = startRow;
    let tempCol = startCol;

    while (true) {
      tempRow = tempRow + row;
      tempCol = tempCol + col;

      // out bound
      if (tempRow < 0 || tempRow > 7 || tempCol < 0 || tempCol > 7) {
        break;
      }

      if (tempRow == endRow && tempCol == endCol) {
        return true;
      }

      if (board[tempRow * 8 + tempCol]) {
        break;
      }
    }
  }

  console.log("could not found any matching end");

  return false;
};

const checkKingMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  board: Array<Piece>
) => {
  for (const [row, col] of QUEEN_MOVIES) {
    let tempRow = startRow + row;
    let tempCol = startCol + col;

    // out bound
    if (tempRow < 0 || tempRow > 7 || tempCol < 0 || tempCol > 7) {
      continue;
    }

    if (tempRow == endRow && tempCol == endCol) {
      return true;
    }

    if (board[tempRow * 8 + tempCol]) {
      continue;
    }
  }

  console.log("could not found any matching end");

  return false;
};

export const checkMove = (
  startLocation: number,
  endLocation: number,
  playerType: PlayerTypes,
  isTryingToCapture: boolean,
  board: Array<Piece>
) => {
  const startRow = Math.floor(startLocation / 8);
  const startCol = startLocation % 8;
  const endRow = Math.floor(endLocation / 8);
  const endCol = endLocation % 8;

  const targetPiece = board[startLocation];

  if (targetPiece == Piece.WHITE_PAWN || targetPiece == Piece.BLACK_PAWN) {
    return checkPawnMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture,
      board
    );
  } else if (
    targetPiece == Piece.WHITE_ROOK ||
    targetPiece == Piece.BLACK_ROOK
  ) {
    return checkRookMoves(startRow, startCol, endRow, endCol, board);
  } else if (
    targetPiece == Piece.WHITE_KNIGHT ||
    targetPiece == Piece.BLACK_KNIGHT
  ) {
    return checkKnightMoves(startRow, startCol, endRow, endCol);
  } else if (
    targetPiece == Piece.WHITE_BISHOP ||
    targetPiece == Piece.BLACK_BISHOP
  ) {
    return checkBishopMoves(startRow, startCol, endRow, endCol, board);
  } else if (
    targetPiece == Piece.WHITE_QUEEN ||
    targetPiece == Piece.BLACK_QUEEN
  ) {
    return checkQueenMoves(startRow, startCol, endRow, endCol, board);
  } else if (
    targetPiece == Piece.WHITE_KING ||
    targetPiece == Piece.BLACK_KING
  ) {
    return checkKingMoves(startRow, startCol, endRow, endCol, board);
  }
};
