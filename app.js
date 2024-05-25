const CHESS_PIECES = require("./constants.js");

let board = [];
const capturedPieces = [];

for (let i = 0; i < 8; i++) {
  board.push([]);
  for (let j = 0; j < 8; j++) {
    board[i].push("");
  }
}

// initial setup
// for (let i = 0; i < 8; i++) {
//   board[1][i] = CHESS_PIECES.WHITE_PAWN;
//   board[6][i] = CHESS_PIECES.BLACK_PAWN;
// }

// board[0][0] = CHESS_PIECES.WHITE_ROOK;
// board[0][1] = CHESS_PIECES.WHITE_KNIGHT;
// board[0][2] = CHESS_PIECES.WHITE_BISHOP;
// board[0][3] = CHESS_PIECES.WHITE_QUEEN;
// board[0][4] = CHESS_PIECES.WHITE_KING;
// board[0][5] = CHESS_PIECES.WHITE_BISHOP;
// board[0][6] = CHESS_PIECES.WHITE_KNIGHT;
// board[0][7] = CHESS_PIECES.WHITE_ROOK;

// board[7][0] = CHESS_PIECES.BLACK_ROOK;
// board[7][1] = CHESS_PIECES.BLACK_KNIGHT;
// board[7][2] = CHESS_PIECES.BLACK_BISHOP;
// board[7][3] = CHESS_PIECES.BLACK_QUEEN;
// board[7][4] = CHESS_PIECES.BLACK_KING;
// board[7][5] = CHESS_PIECES.BLACK_BISHOP;
// board[7][6] = CHESS_PIECES.BLACK_KNIGHT;
// board[7][7] = CHESS_PIECES.BLACK_ROOK;

board = [
  [
    "",
    "w_knight",
    "w_bishop",
    "w_queen",
    "w_king",
    "w_bishop",
    "w_knight",
    "w_rook",
  ],
  ["", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn", "w_pawn"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "w_rook"],
  ["", "", "", "", "", "w_knight", "", ""],
  ["b_pawn", "", "", "", "", "", "", ""],
  ["", "", "b_pawn", "", "b_pawn", "b_pawn", "b_pawn", "b_pawn"],
  [
    "b_rook",
    "",
    "b_bishop",
    "b_queen",
    "b_king",
    "b_bishop",
    "b_knight",
    "b_rook",
  ],
];

const checkPawnMoves = (
  startRow,
  startCol,
  endRow,
  endCol,
  playerType,
  isTryingToCapture = false
) => {
  const multi = playerType == 0 ? -1 : 1;

  let rowDiff = playerType * (startRow - endRow);
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
      } else if (board[startRow + multi * -1][startCol]) {
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

const checkRookMoves = (startRow, startCol, endRow, endCol) => {
  if (startRow !== endRow && startCol !== endCol) {
    console.log("trying to go invalid path");
    return false;
  }

  let tempRow = startRow;
  let tempCol = startCol;

  while (tempRow != endRow && tempCol != endCol) {
    if (board[tempRow][tempCol]) {
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

const checkKnightMoves = (startRow, startCol, endRow, endCol) => {
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

const checkBishopMoves = (startRow, startCol, endRow, endCol, playerType) => {
  const multi = playerType == 0 ? 1 : 1;

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

      if (board[tempRow][tempCol]) {
        break;
      }
    }
  }

  console.log("could not found any matching end");

  return false;
};

/*
 for loop
  if reach end: return true

  if another piece in path
    return false

*/

const move = (startRow, startCol, endRow, endCol, playerType) => {
  const targetPiece = board[startRow][startCol];
  const isTryingToCapture =
    board[endRow][endCol] &&
    board[endRow][endCol].startsWith(playerType == 0 ? "b" : "w");

  // out of board
  if (
    endRow < 0 ||
    endRow > 7 ||
    endRow < 0 ||
    endCol > 7 ||
    (!isTryingToCapture && board[endRow][endCol])
  ) {
    console.log("Trying to go out of board or capture own piece");
    return;
  }

  console.log("target", targetPiece, startRow, startCol);

  if (!targetPiece) {
    console.log("could not find the piece");
    return;
  }

  if (
    board[endRow][endCol] &&
    board[endRow][endCol].startsWith(playerType == 0 ? "w" : "b")
  ) {
    console.log("can not capture own piece", board[endRow][endCol]);
    return;
  }

  if (
    targetPiece == CHESS_PIECES.BLACK_PAWN ||
    targetPiece == CHESS_PIECES.WHITE_PAWN
  ) {
    if (
      checkPawnMoves(
        startRow,
        startCol,
        endRow,
        endCol,
        playerType,
        isTryingToCapture
      )
    ) {
      if (isTryingToCapture) {
        let capturedPiece = board[endRow][endCol];
        capturedPieces.push(capturedPiece);
        console.log("capturedPiece", capturedPiece);
      }
      board[startRow][startCol] = "";
      board[endRow][endCol] = targetPiece;
    }
  } else if (
    targetPiece == CHESS_PIECES.BLACK_ROOK ||
    targetPiece == CHESS_PIECES.WHITE_ROOK
  ) {
    if (checkRookMoves(startRow, startCol, endRow, endCol, playerType)) {
      if (isTryingToCapture) {
        let capturedPiece = board[endRow][endCol];
        capturedPieces.push(capturedPiece);
        console.log("capturedPiece", capturedPieces);
      }
      board[startRow][startCol] = "";
      board[endRow][endCol] = targetPiece;
    }
  } else if (
    targetPiece == CHESS_PIECES.BLACK_KNIGHT ||
    targetPiece == CHESS_PIECES.WHITE_KNIGHT
  ) {
    if (checkKnightMoves(startRow, startCol, endRow, endCol)) {
      if (isTryingToCapture) {
        let capturedPiece = board[endRow][endCol];
        capturedPieces.push(capturedPiece);
        console.log("capturedPiece", capturedPieces);
      }
      board[startRow][startCol] = "";
      board[endRow][endCol] = targetPiece;
    }
  } else if (
    targetPiece == CHESS_PIECES.BLACK_BISHOP ||
    targetPiece == CHESS_PIECES.WHITE_BISHOP
  ) {
    console.log("bishop");
    if (checkBishopMoves(startRow, startCol, endRow, endCol, playerType)) {
      if (isTryingToCapture) {
        let capturedPiece = board[endRow][endCol];
        capturedPieces.push(capturedPiece);
        console.log("capturedPiece", capturedPieces);
      }
      board[startRow][startCol] = "";
      board[endRow][endCol] = targetPiece;
    }
  }

  console.log(
    "",
    startRow,
    startCol,
    endRow,
    endCol,
    "player type",
    playerType
  );

  console.log("board", board);
};

move(7, 2, 4, 5, 1);
