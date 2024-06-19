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
  ["", "", "b_pawn", "", "", "b_pawn", "b_pawn", "b_pawn"],
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

const gameHistory = [];

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

const QUEEN_MOVIES = [...BISHOP_MOVES, [1, 0], [0, 1], [-1, 0], [0, -1]];

const checkQueenMoves = (startRow, startCol, endRow, endCol, playerType) => {
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

      if (board[tempRow][tempCol]) {
        break;
      }
    }
  }

  console.log("could not found any matching end");

  return false;
};

const checkKingMoves = (startRow, startCol, endRow, endCol, playerType) => {
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

    if (board[tempRow][tempCol]) {
      continue;
    }
  }

  console.log("could not found any matching end");

  return false;
};

const checkMove = (
  startRow,
  startCol,
  endRow,
  endCol,
  playerType,
  isTryingToCapture
) => {
  switch (piece) {
    case CHESS_PIECES.WHITE_PAWN || CHESS_PIECES.BLACK_PAWN: {
      return checkPawnMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }
    case CHESS_PIECES.WHITE_ROOK || CHESS_PIECES.BLACK_ROOK: {
      return checkRookMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }
    case CHESS_PIECES.WHITE_KNIGHT || CHESS_PIECES.BLACK_KNIGHT: {
      return checkKnightMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }
    case CHESS_PIECES.WHITE_BISHOP || CHESS_PIECES.BLACK_BISHOP: {
      return checkBishopMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }
    case CHESS_PIECES.WHITE_QUEEN || CHESS_PIECES.BLACK_QUEEN: {
      return checkQueenMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }
    case CHESS_PIECES.WHITE_KING || CHESS_PIECES.BLACK_KING: {
      return checkKingMoves(
        startRow,
        startCol,
        targetKing.row,
        targetKing.col,
        playerType,
        isTryingToCapture
      );
    }

    default:
      throw error("Unknown Piece move");
  }
};

/*
 for loop
  if reach end: return true

  if another piece in path
    return false

*/

const move = (startRow, startCol, endRow, endCol, playerType) => {
  const targetPiece = board[startRow][startCol];

  if (!targetPiece) {
    console.log("There is no target piece");
    return;
  }

  if (gameHistory.length > 0) {
    if (gameHistory[gameHistory?.length - 1]?.playerType == playerType) {
      console.log("A player can not play multiple times in a row");
      return;
    }
  }

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

  if (
    board[endRow][endCol] &&
    board[endRow][endCol].startsWith(playerType == 0 ? "w" : "b")
  ) {
    console.log("can not capture own piece", board[endRow][endCol]);
    return;
  }

  let capturedPiece;

  // if (
  //   targetPiece == CHESS_PIECES.BLACK_PAWN ||
  //   targetPiece == CHESS_PIECES.WHITE_PAWN
  // ) {
  //   if (
  //     checkPawnMoves(
  //       startRow,
  //       startCol,
  //       endRow,
  //       endCol,
  //       playerType,
  //       isTryingToCapture
  //     )
  //   ) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // } else if (
  //   targetPiece == CHESS_PIECES.BLACK_ROOK ||
  //   targetPiece == CHESS_PIECES.WHITE_ROOK
  // ) {
  //   if (checkRookMoves(startRow, startCol, endRow, endCol, playerType)) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // } else if (
  //   targetPiece == CHESS_PIECES.BLACK_KNIGHT ||
  //   targetPiece == CHESS_PIECES.WHITE_KNIGHT
  // ) {
  //   if (checkKnightMoves(startRow, startCol, endRow, endCol)) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // } else if (
  //   targetPiece == CHESS_PIECES.BLACK_BISHOP ||
  //   targetPiece == CHESS_PIECES.WHITE_BISHOP
  // ) {
  //   console.log("bishop");
  //   if (checkBishopMoves(startRow, startCol, endRow, endCol, playerType)) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // } else if (
  //   targetPiece == CHESS_PIECES.BLACK_QUEEN ||
  //   targetPiece == CHESS_PIECES.WHITE_QUEEN
  // ) {
  //   console.log("queen");
  //   if (checkQueenMoves(startRow, startCol, endRow, endCol, playerType)) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // } else if (
  //   targetPiece == CHESS_PIECES.BLACK_KING ||
  //   targetPiece == CHESS_PIECES.WHITE_KING
  // ) {
  //   console.log("king");
  //   if (checkKingMoves(startRow, startCol, endRow, endCol, playerType)) {
  //     if (isTryingToCapture) {
  //       capturedPiece = board[endRow][endCol];
  //     }
  //     board[startRow][startCol] = "";
  //     board[endRow][endCol] = targetPiece;
  //   }
  // }

  // check if move successful
  if (startCol != endCol || startRow != endRow) {
    gameHistory.push({
      playerType,
      startRow,
      startCol,
      endRow,
      endCol,
      capturedPiece,
    });

    if (capturedPiece) {
      capturedPieces.push(capturedPiece);
    }
  }

  // king checkmate check

  const mapping = {};
  let pieceType = playerType == 0 ? "b" : "w";
  let targetKing = {};

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      let piece = board[row][col];

      if (piece.startsWith(pieceType)) {
        mapping[`${piece}-${row}-${col}`] = { row, col };
      } else if (piece.includes("king")) {
        targetKing = { row, col };
      }
    }
  }

  let kingChecked;

  for (let key in mapping) {
    let piece = key.split("-")[0];

    switch (piece) {
      case CHESS_PIECES.WHITE_PAWN || CHESS_PIECES.BLACK_PAWN: {
        kingChecked = checkPawnMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }
      case CHESS_PIECES.WHITE_ROOK || CHESS_PIECES.BLACK_ROOK: {
        kingChecked = checkRookMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }
      case CHESS_PIECES.WHITE_KNIGHT || CHESS_PIECES.BLACK_KNIGHT: {
        kingChecked = checkKnightMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }
      case CHESS_PIECES.WHITE_BISHOP || CHESS_PIECES.BLACK_BISHOP: {
        kingChecked = checkBishopMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }
      case CHESS_PIECES.WHITE_QUEEN || CHESS_PIECES.BLACK_QUEEN: {
        kingChecked = checkQueenMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }
      case CHESS_PIECES.WHITE_KING || CHESS_PIECES.BLACK_KING: {
        kingChecked = checkKingMoves(
          startRow,
          startCol,
          targetKing.row,
          targetKing.col,
          playerType,
          true
        );
        break;
      }

      default:
        throw error("Unknown Piece");
    }

    if (kingChecked) {
      break;
    }
  }

  console.log("mapping", mapping);

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

  console.log("gameHistory", gameHistory);
};

move(7, 0, 6, 0, 1);
