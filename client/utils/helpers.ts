import { GameResult, PieceTypes, PlayerTypes } from "./enums";

const checkPawnMoves = (
  startLocation: number,
  endLocation: number,
  playerType: PlayerTypes,
  board: Array<PieceTypes>
) => {
  const direction = playerType === PlayerTypes.WHITE ? -8 : 8;
  const startRow = Math.floor(startLocation / 8);
  const endRow = Math.floor(endLocation / 8);
  const startCol = startLocation % 8;
  const endCol = endLocation % 8;

  // Capture moves
  if (
    board[endLocation] !== PieceTypes.EMPTY &&
    Math.abs(startCol - endCol) === 1 &&
    endRow - startRow === direction / 8
  ) {
    return true;
  }

  // Forward moves
  if (board[endLocation] === PieceTypes.EMPTY && startCol === endCol) {
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
        board[startLocation + direction] === PieceTypes.EMPTY
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
  board: Array<PieceTypes>
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

const KNIGHT_MOVES = [-17, -15, -10, -6, 6, 10, 15, 17];

const checkKnightMoves = (startLocation: number, endLocation: number) => {
  return KNIGHT_MOVES.some(
    (move) =>
      startLocation + move === endLocation &&
      Math.abs((startLocation % 8) - (endLocation % 8)) <= 2
  );
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
  board: Array<PieceTypes>
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

const checkSlidingPieceMoves = (
  startLocation: number,
  endLocation: number,
  board: Array<PieceTypes>,
  moves: number[][]
) => {
  const startRow = Math.floor(startLocation / 8);
  const startCol = startLocation % 8;
  const endRow = Math.floor(endLocation / 8);
  const endCol = endLocation % 8;

  // initial check
  const selectedPiece = board[startLocation];
  if (
    (selectedPiece == PieceTypes.WHITE_ROOK ||
      selectedPiece == PieceTypes.BLACK_ROOK) &&
    startRow !== endRow &&
    startCol !== endCol
  ) {
    return false;
  } else if (
    (selectedPiece == PieceTypes.WHITE_BISHOP ||
      selectedPiece == PieceTypes.BLACK_BISHOP) &&
    Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)
  ) {
    return false;
  }

  for (const [row, col] of moves) {
    let tempRow = startRow;
    let tempCol = startCol;

    while (true) {
      tempRow += row;
      tempCol += col;

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

  return false;
};

const checkKingMoves = (
  startLocation: number,
  endLocation: number,
  board: Array<PieceTypes>
) => {
  const startRow = Math.floor(startLocation / 8);
  const startCol = startLocation % 8;
  const endRow = Math.floor(endLocation / 8);
  const endCol = endLocation % 8;

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

  return false;
};

export const checkMove = (
  startLocation: number,
  endLocation: number,
  playerType: PlayerTypes,
  board: Array<PieceTypes>
) => {
  const targetPiece = board[startLocation];

  if (
    targetPiece == PieceTypes.WHITE_PAWN ||
    targetPiece == PieceTypes.BLACK_PAWN
  ) {
    return checkPawnMoves(startLocation, endLocation, playerType, board);
  } else if (
    targetPiece == PieceTypes.WHITE_ROOK ||
    targetPiece == PieceTypes.BLACK_ROOK
  ) {
    return checkSlidingPieceMoves(
      startLocation,
      endLocation,
      board,
      ROOK_MOVES
    );
  } else if (
    targetPiece == PieceTypes.WHITE_KNIGHT ||
    targetPiece == PieceTypes.BLACK_KNIGHT
  ) {
    return checkKnightMoves(startLocation, endLocation);
  } else if (
    targetPiece == PieceTypes.WHITE_BISHOP ||
    targetPiece == PieceTypes.BLACK_BISHOP
  ) {
    return checkSlidingPieceMoves(
      startLocation,
      endLocation,
      board,
      BISHOP_MOVES
    );
  } else if (
    targetPiece == PieceTypes.WHITE_QUEEN ||
    targetPiece == PieceTypes.BLACK_QUEEN
  ) {
    return checkSlidingPieceMoves(
      startLocation,
      endLocation,
      board,
      QUEEN_MOVIES
    );
  } else if (
    targetPiece == PieceTypes.WHITE_KING ||
    targetPiece == PieceTypes.BLACK_KING
  ) {
    return checkKingMoves(startLocation, endLocation, board);
  }
};

export function isCheckmate(
  board: Array<PieceTypes>,
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

export function findKingPosition(
  board: Array<PieceTypes>,
  player: PlayerTypes
): number {
  const kingPiece =
    player === PlayerTypes.WHITE
      ? PieceTypes.WHITE_KING
      : PieceTypes.BLACK_KING;
  return board.findIndex((piece) => piece === kingPiece);
}

export function isKingInCheck(
  board: Array<PieceTypes>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  for (let i = 0; i < 64; i++) {
    if (board[i] !== PieceTypes.EMPTY && isOpponentPiece(player, board[i])) {
      if (checkMove(i, kingPosition, oppositePlayer(player), board)) {
        return true;
      }
    }
  }
  return false;
}

function canKingMove(
  board: Array<PieceTypes>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  for (const direction of directions) {
    const newKingPosition = kingPosition + direction;
    if (
      newKingPosition >= 0 &&
      newKingPosition < 64 &&
      Math.abs((kingPosition % 8) - (newKingPosition % 8)) <= 1 &&
      !isPlayerPiece(player, board[newKingPosition])
    ) {
      if (checkMove(kingPosition, newKingPosition, player, board)) {
        const tempBoard = [...board];
        tempBoard[newKingPosition] = tempBoard[kingPosition];
        tempBoard[kingPosition] = PieceTypes.EMPTY;
        if (!isKingInCheck(tempBoard, newKingPosition, player)) {
          return true;
        }
      }
    }
  }
  return false;
}

function canBlockOrCaptureAttacker(
  board: Array<PieceTypes>,
  kingPosition: number,
  player: PlayerTypes
): boolean {
  const attackingPositions = findAttackingPieces(board, kingPosition, player);

  for (let i = 0; i < 64; i++) {
    if (board[i] !== PieceTypes.EMPTY && isPlayerPiece(player, board[i])) {
      for (const attackPos of attackingPositions) {
        // Check if we can capture the attacker
        if (checkMove(i, attackPos, player, board)) {
          const tempBoard = [...board];
          tempBoard[attackPos] = tempBoard[i];
          tempBoard[i] = PieceTypes.EMPTY;
          if (!isKingInCheck(tempBoard, kingPosition, player)) {
            return true;
          }
        }

        if (
          board[attackPos] !== PieceTypes.BLACK_KNIGHT &&
          board[attackPos] !== PieceTypes.WHITE_KNIGHT
        ) {
          // Check if we can block the attack
          const blockPositions = getPositionsBetween(kingPosition, attackPos);
          for (const blockPos of blockPositions) {
            if (checkMove(i, blockPos, player, board)) {
              const tempBoard = [...board];
              tempBoard[blockPos] = tempBoard[i];
              tempBoard[i] = PieceTypes.EMPTY;
              // Cause king position can be changed after blocking
              const newKingPosition = findKingPosition(tempBoard, player);
              if (!isKingInCheck(tempBoard, newKingPosition, player)) {
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
}

function findAttackingPieces(
  board: Array<PieceTypes>,
  kingPosition: number,
  player: PlayerTypes
): number[] {
  const attackingPositions = [];

  for (let i = 0; i < 64; i++) {
    if (
      board[i] !== PieceTypes.EMPTY &&
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
  const startRow = Math.floor(start / 8); // 0
  const startCol = start % 8; // 4
  const endRow = Math.floor(end / 8); // 1
  const endCol = end % 8; // 2

  const rowStep = Math.sign(endRow - startRow); // +1
  const colStep = Math.sign(endCol - startCol); // -1

  let currentRow = startRow + rowStep; // 1 2
  let currentCol = startCol + colStep; // 3 2

  while (currentRow !== endRow || currentCol !== endCol) {
    positions.push(currentRow * 8 + currentCol);
    currentRow += rowStep;
    currentCol += colStep;
  }

  return positions;
}

export const oppositePlayer = (currentPlayer: PlayerTypes): PlayerTypes =>
  currentPlayer === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE;

export const isWhitePiece = (piece: PieceTypes): boolean =>
  piece >= PieceTypes.WHITE_PAWN && piece <= PieceTypes.WHITE_KING;

export const isBlackPiece = (piece: PieceTypes): boolean =>
  piece >= PieceTypes.BLACK_PAWN && piece <= PieceTypes.BLACK_KING;

export const isPlayerPiece = (
  player: PlayerTypes,
  piece: PieceTypes
): boolean =>
  player === PlayerTypes.WHITE ? isWhitePiece(piece) : isBlackPiece(piece);

export const isOpponentPiece = (
  player: PlayerTypes,
  piece: PieceTypes
): boolean =>
  player === PlayerTypes.WHITE ? isBlackPiece(piece) : isWhitePiece(piece);

export const getResult = (currentPlayer: PlayerTypes): GameResult =>
  currentPlayer === PlayerTypes.WHITE
    ? GameResult.BLACK_WINS
    : GameResult.WHITE_WINS;
