const CHESS_PIECES = require("./constants.js");

let board = [
  [
    CHESS_PIECES.WHITE_ROOK,
    CHESS_PIECES.WHITE_KNIGHT,
    CHESS_PIECES.WHITE_BISHOP,
    CHESS_PIECES.WHITE_QUEEN,
    CHESS_PIECES.WHITE_KING,
    CHESS_PIECES.WHITE_BISHOP,
    CHESS_PIECES.WHITE_KNIGHT,
    CHESS_PIECES.WHITE_ROOK,
  ],
  [
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
    CHESS_PIECES.WHITE_PAWN,
  ],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
    CHESS_PIECES.BLACK_PAWN,
  ],
  [
    CHESS_PIECES.BLACK_ROOK,
    CHESS_PIECES.BLACK_KNIGHT,
    CHESS_PIECES.BLACK_BISHOP,
    CHESS_PIECES.BLACK_QUEEN,
    CHESS_PIECES.BLACK_KING,
    CHESS_PIECES.BLACK_BISHOP,
    CHESS_PIECES.BLACK_KNIGHT,
    CHESS_PIECES.BLACK_ROOK,
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
  const targetPiece = board[startRow][startCol];

  if (
    targetPiece == CHESS_PIECES.WHITE_PAWN ||
    targetPiece == CHESS_PIECES.BLACK_PAWN
  ) {
    return checkPawnMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
  } else if (
    targetPiece == CHESS_PIECES.WHITE_ROOK ||
    targetPiece == CHESS_PIECES.BLACK_ROOK
  ) {
    return checkRookMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
  } else if (
    targetPiece == CHESS_PIECES.WHITE_KNIGHT ||
    targetPiece == CHESS_PIECES.BLACK_KNIGHT
  ) {
    return checkKnightMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
  } else if (
    targetPiece == CHESS_PIECES.WHITE_BISHOP ||
    targetPiece == CHESS_PIECES.BLACK_BISHOP
  ) {
    return checkBishopMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
  } else if (
    targetPiece == CHESS_PIECES.WHITE_QUEEN ||
    targetPiece == CHESS_PIECES.BLACK_QUEEN
  ) {
    return checkQueenMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
  } else if (
    targetPiece == CHESS_PIECES.WHITE_KING ||
    targetPiece == CHESS_PIECES.BLACK_KING
  ) {
    return checkKingMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );
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

  if (checkMove(startRow, startCol, endRow, endCol, playerType)) {
    if (isTryingToCapture) {
      capturedPiece = board[endRow][endCol];
    }
    board[startRow][startCol] = "";
    board[endRow][endCol] = targetPiece;
  }

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

  console.log("Checking king check");

  for (let key in mapping) {
    if (
      checkMove(
        mapping[key].row,
        mapping[key].col,
        targetKing.row,
        targetKing.col,
        true
      )
    ) {
      board[startRow][endRow] = board[endRow][endCol];

      if (isTryingToCapture) {
        board[endRow][endCol] = capturedPiece;
      }

      console.log("King will be in check");
      return;
    }
  }

  // console.log("mapping", mapping);

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
