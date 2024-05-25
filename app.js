const CHESS_PIECES = require("./constants.js");

const board = [];
const capturedPieces = [];

for (let i = 0; i < 8; i++) {
  board.push([]);
  for (let j = 0; j < 8; j++) {
    board[i].push("");
  }
}

// initial setup
for (let i = 0; i < 8; i++) {
  board[1][i] = CHESS_PIECES.WHITE_PAWN;
  board[6][i] = CHESS_PIECES.BLACK_PAWN;
}

board[0][0] = CHESS_PIECES.WHITE_ROOK;
board[0][1] = CHESS_PIECES.WHITE_KNIGHT;
board[0][2] = CHESS_PIECES.WHITE_BISHOP;
board[0][3] = CHESS_PIECES.WHITE_QUEEN;
board[0][4] = CHESS_PIECES.WHITE_KING;
board[0][5] = CHESS_PIECES.WHITE_BISHOP;
board[0][6] = CHESS_PIECES.WHITE_KNIGHT;
board[0][7] = CHESS_PIECES.WHITE_ROOK;

board[7][0] = CHESS_PIECES.BLACK_ROOK;
board[7][1] = CHESS_PIECES.BLACK_KNIGHT;
board[7][2] = CHESS_PIECES.BLACK_BISHOP;
board[7][3] = CHESS_PIECES.BLACK_QUEEN;
board[7][4] = CHESS_PIECES.BLACK_KING;
board[7][5] = CHESS_PIECES.BLACK_BISHOP;
board[7][6] = CHESS_PIECES.BLACK_KNIGHT;
board[7][7] = CHESS_PIECES.BLACK_ROOK;

const checkPawnMoves = (
  startRow,
  startCol,
  endRow,
  endCol,
  playerType,
  isTryingToCapture = false
) => {
  const multi = playerType == 0 ? -1 : 1;
  // check outbound
  if (endRow < 0 || endRow > 7 || endRow < 0 || endCol > 7 || (!isTryingToCapture && board[endRow][endCol])) {
    console.log("outbound");
    return false;
  }

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
      } else if(board[row + (multi * 1)][col]) {
        console.log('another piece exist in the path');
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

const move = (startRow, startCol, endRow, endCol, playerType) => {
  const targetPiece = board[startRow][startCol];
  const isTryingToCapture = board[endRow][endCol] && board[endRow][endCol].includes(playerType == 0 ? 'b' : 'w');

  console.log('isTryingToCapture');

  if (!targetPiece) {
    console.log("could not find the piece");
    return;
  }

  if(board[endRow][endCol] && board[endRow][endCol].includes(playerType == 0 ? 'w' : 'b')) {
    console.log('can not capture own piece');
    return;
  }

  if (
    targetPiece == CHESS_PIECES.BLACK_PAWN ||
    targetPiece ||
    CHESS_PIECES.WHITE_PAWN
  ) {
    const checkResult = checkPawnMoves(
      startRow,
      startCol,
      endRow,
      endCol,
      playerType,
      isTryingToCapture
    );

    if (checkResult) {
      if(isTryingToCapture) {
        let capturedPiece = board[endRow][endCol];
        capturedPieces.push(capturedPiece);
        console.log('capturedPiece',capturedPiece)
      }
      board[startRow][startCol] = "";
      board[endRow][endCol] = targetPiece;
    }
  };

  console.log('',startCol, endCol, endRow, endCol, 'player type', playerType);

  console.log("board", board);
};

move(6, 0, 5, 0, 1);

move(6, 1, 4, 1, 1);

move(1, 0, 3, 0, 0);

move(4, 1, 3, 0, 1);

