import { GameNotation, GameHistory } from "./common.interface";
import { initialChessBoard } from "./constants";
import { PieceTypes, PlayerTypes } from "./enums";
import { checkMove } from "./helpers";

function pieceToSymbol(piece: PieceTypes): string {
  switch (piece) {
    case PieceTypes.WHITE_KING:
    case PieceTypes.BLACK_KING:
      return "K";
    case PieceTypes.WHITE_QUEEN:
    case PieceTypes.BLACK_QUEEN:
      return "Q";
    case PieceTypes.WHITE_ROOK:
    case PieceTypes.BLACK_ROOK:
      return "R";
    case PieceTypes.WHITE_BISHOP:
    case PieceTypes.BLACK_BISHOP:
      return "B";
    case PieceTypes.WHITE_KNIGHT:
    case PieceTypes.BLACK_KNIGHT:
      return "N";
    default:
      return "";
  }
}

function squareToAlgebraic(square: number): string {
  const file = String.fromCharCode("a".charCodeAt(0) + (square % 8));
  const rank = 8 - Math.floor(square / 8);
  return `${file}${rank}`;
}

function moveToAlgebraic(
  move: GameHistory,
  previousBoard: Array<PieceTypes>
): string {
  let notation = "";

  if (move.isCastling) {
    notation = move.to % 8 > move.from % 8 ? "O-O" : "O-O-O";
  } else {
    const pieceSymbol = pieceToSymbol(move.piece);
    const fromSquare = squareToAlgebraic(move.from);
    const toSquare = squareToAlgebraic(move.to);

    if (pieceSymbol === "") {
      // Pawn move
      notation = move.capturedPiece ? `${fromSquare[0]}x${toSquare}` : toSquare;
    } else {
      // PieceTypes move
      notation = `${pieceSymbol}${move.capturedPiece ? "x" : ""}${toSquare}`;

      // Check for ambiguity
      const sameTypePieces = previousBoard.reduce((acc, piece, index) => {
        if (piece === move.piece && index !== move.from) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      if (sameTypePieces.length > 0) {
        const ambiguousMoves = sameTypePieces.filter((from) =>
          checkMove(
            from,
            move.to,
            move.piece <= 6 ? PlayerTypes.WHITE : PlayerTypes.BLACK,
            previousBoard
          )
        );

        if (ambiguousMoves.length > 0) {
          notation = `${pieceSymbol}${fromSquare}${
            move.capturedPiece ? "x" : ""
          }${toSquare}`;
        }
      }
    }

    if (move.isPromotion) {
      notation += `=${pieceToSymbol(move.promotedTo!)}`;
    }
  }

  if (move.isCheckmate) {
    notation += "#";
  } else if (move.isCheck) {
    notation += "+";
  }

  return notation;
}

export function generateGameNotation(
  gameHistory: GameHistory[]
): GameNotation[] {
  let notations = [];
  let moveNumber = 1;

  for (let i = 0; i < gameHistory.length; i += 2) {
    let notation = {
      serial: moveNumber,
      white: { notation: "", historyIndex: i },
      black: { notation: "", historyIndex: 0 },
    };

    notation.white.notation = moveToAlgebraic(
      gameHistory[i],
      i > 0 ? gameHistory[i - 1].board : initialChessBoard
    );

    if (i + 1 < gameHistory.length) {
      notation.black.notation = moveToAlgebraic(
        gameHistory[i + 1],
        gameHistory[i].board
      );
      notation.black.historyIndex = i + 1;
    }

    notations.push(notation);

    moveNumber++;
  }

  return notations;
}
