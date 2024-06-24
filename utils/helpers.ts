import { Piece, PlayerTypes } from "./enums";

const checkPawnMoves = (
  startLocation: number,
  endLocation: number,
  playerType: PlayerTypes,
  board: Array<Piece>
) => {
  const direction = playerType === PlayerTypes.WHITE ? -8 : 8;
  const startRow = Math.floor(startLocation / 8);
  const endRow = Math.floor(endLocation / 8);
  const startCol = startLocation % 8;
  const endCol = endLocation % 8;

  // Capture moves
  if (
    board[endLocation] !== Piece.EMPTY &&
    Math.abs(startCol - endCol) === 1 &&
    endRow - startRow === direction / 8
  ) {
    return true;
  }

  // Forward moves
  if (board[endLocation] === Piece.EMPTY && startCol === endCol) {
    // Single step forward
    if (endLocation - startLocation === direction) {
      return true;
    }
    // Double step from starting position
    if (
      (playerType === PlayerTypes.WHITE && startRow === 6) ||
      (playerType === PlayerTypes.BLACK && startRow === 1)
    ) {
      if (
        endLocation - startLocation === direction * 2 &&
        board[startLocation + direction] === Piece.EMPTY
      ) {
        return true;
      }
    }
  }

  return false;
};

const ROOK_MOVES = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const checkRookMoves = (
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  board: Array<Piece>
) => {
  if (startRow !== endRow && startCol !== endCol) {
    // console.log("trying to go invalid path");
    return false;
  }

  for (const [row, col] of ROOK_MOVES) {
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

  // console.log("could not found any matching end");

  return false;
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

  // console.log("could not found any matching end");

  return false;
};

const QUEEN_MOVIES = [...BISHOP_MOVES, ...ROOK_MOVES];

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

  // console.log("could not found any matching end");

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

  // console.log("could not found any matching end");

  return false;
};

export const checkMove = (
  startLocation: number,
  endLocation: number,
  playerType: PlayerTypes,
  board: Array<Piece>
) => {
  const startRow = Math.floor(startLocation / 8);
  const startCol = startLocation % 8;
  const endRow = Math.floor(endLocation / 8);
  const endCol = endLocation % 8;

  const targetPiece = board[startLocation];

  if (targetPiece == Piece.WHITE_PAWN || targetPiece == Piece.BLACK_PAWN) {
    return checkPawnMoves(startLocation, endLocation, playerType, board);
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

export function isCheckmate(
  board: Array<Piece>,
  currentPlayer: PlayerTypes
): boolean {
  const kingPosition = findKingPosition(board, currentPlayer);

  if (kingPosition === -1) return false; // King not found, shouldn't happen in a valid game

  // If the king is not in check, it's not checkmate
  if (!isKingInCheck(board, kingPosition, currentPlayer)) return false;

  // Check if the king can move to a safe square
  if (canKingMove(board, kingPosition, currentPlayer)) return false;

  // Check if any piece can block the check or capture the attacking piece
  if (canBlockOrCaptureAttacker(board, kingPosition, currentPlayer))
    return false;

  // If none of the above conditions are met, it's checkmate
  return true;
}

function findKingPosition(board: Array<Piece>, player: PlayerTypes): number {
  const kingPiece =
    player === PlayerTypes.WHITE ? Piece.WHITE_KING : Piece.BLACK_KING;
  return board.findIndex((piece) => piece === kingPiece);
}

function isKingInCheck(
  board: Array<Piece>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  const oppositePlayer =
    player === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE;
  for (let i = 0; i < 64; i++) {
    if (board[i] !== Piece.EMPTY && isOpponentPiece(player, board[i])) {
      if (checkMove(i, kingPosition, oppositePlayer, board)) {
        return true;
      }
    }
  }
  return false;
}

function canKingMove(
  board: Array<Piece>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  for (const direction of directions) {
    const newPosition = kingPosition + direction;
    if (
      newPosition >= 0 &&
      newPosition < 64 &&
      Math.abs((kingPosition % 8) - (newPosition % 8)) <= 1
    ) {
      if (checkMove(kingPosition, newPosition, player, board)) {
        const tempBoard = [...board];
        tempBoard[newPosition] = tempBoard[kingPosition];
        tempBoard[kingPosition] = Piece.EMPTY;
        if (!isKingInCheck(tempBoard, newPosition, player)) {
          return true;
        }
      }
    }
  }
  return false;
}

function canBlockOrCaptureAttacker(
  board: Array<Piece>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  const attackingPositions = findAttackingPieces(board, kingPosition, player);

  for (let i = 0; i < 64; i++) {
    if (board[i] !== Piece.EMPTY && isPlayerPiece(player, board[i])) {
      for (const attackPos of attackingPositions) {
        // Check if we can capture the attacker
        if (checkMove(i, attackPos, player, board)) {
          const tempBoard = [...board];
          tempBoard[attackPos] = tempBoard[i];
          tempBoard[i] = Piece.EMPTY;
          if (!isKingInCheck(tempBoard, kingPosition, player)) {
            return true;
          }
        }

        // Check if we can block the attack
        const blockPositions = getPositionsBetween(kingPosition, attackPos);
        for (const blockPos of blockPositions) {
          if (checkMove(i, blockPos, player, board)) {
            const tempBoard = [...board];
            tempBoard[blockPos] = tempBoard[i];
            tempBoard[i] = Piece.EMPTY;
            if (!isKingInCheck(tempBoard, kingPosition, player)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function findAttackingPieces(
  board: Array<Piece>,
  kingPosition: number,
  player: PlayerTypes
): number[] {
  const attackingPositions = [];

  for (let i = 0; i < 64; i++) {
    if (
      board[i] !== Piece.EMPTY &&
      (player === PlayerTypes.WHITE
        ? board[i] > 6
        : board[i] <= 6 && board[i] > 0)
    ) {
      if (checkMove(i, kingPosition, oppositePlayer(player), board)) {
        attackingPositions.push(i);
      }
    }
  }

  return attackingPositions;
}

function getPositionsBetween(start: number, end: number): number[] {
  const positions = [];
  const startRow = Math.floor(start / 8);
  const startCol = start % 8;
  const endRow = Math.floor(end / 8);
  const endCol = end % 8;

  const rowStep = Math.sign(endRow - startRow);
  const colStep = Math.sign(endCol - startCol);

  let currentRow = startRow + rowStep;
  let currentCol = startCol + colStep;

  while (currentRow !== endRow || currentCol !== endCol) {
    positions.push(currentRow * 8 + currentCol);
    currentRow += rowStep;
    currentCol += colStep;
  }

  return positions;
}

export const oppositePlayer = (currentPlayer: PlayerTypes): PlayerTypes =>
  currentPlayer === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE;

export const isWhitePiece = (piece: Piece): boolean =>
  piece >= Piece.WHITE_PAWN && piece <= Piece.WHITE_KING;

export const isBlackPiece = (piece: Piece): boolean =>
  piece >= Piece.BLACK_PAWN && piece <= Piece.BLACK_KING;

export const isPlayerPiece = (player: PlayerTypes, piece: Piece): boolean =>
  player === PlayerTypes.WHITE ? isWhitePiece(piece) : isBlackPiece(piece);

export const isOpponentPiece = (player: PlayerTypes, piece: Piece): boolean =>
  player === PlayerTypes.WHITE ? isBlackPiece(piece) : isWhitePiece(piece);
