import React from "react";
import { checkMove } from "../../utils/helpers";
import { Piece as PieceEnums, PlayerTypes } from "../../utils/enums";

interface SquareProps {
  index: number;
  gameState: any;
  children: React.ReactNode;
}

export default function Square({ index, children, gameState }: SquareProps) {
  const { selectedLocation, currentPlayer, board } = gameState;

  const getCellColor = (index: number) => {
    const isEvenRow = Math.floor(index / 8) % 2 === 0;
    const isEvenCol = index % 2 === 0;
    if ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)) {
      return "bg-white";
    } else {
      return "bg-black";
    }
  };

  /*
  startLocation: number,
  endLocation: number, (this index)
  playerType: PlayerTypes,
  isTryingToCapture: boolean,
  board: Array<Piece>

  available moves:
  available captures:
  no style:
  */

  const canMoveCheckerStyle = () => {
    if (selectedLocation == null) {
      return "";
    }

    // can not capture own piece
    if (
      currentPlayer == PlayerTypes.WHITE
        ? board[index] > 0 && board[index] < 7
        : board[index] > 6
    ) {
      return "";
    }

    // can not move other player's piece
    if (
      currentPlayer == PlayerTypes.WHITE
        ? board[selectedLocation] > 6
        : board[selectedLocation] > 0 && board[selectedLocation] < 7
    ) {
      return "";
    }

    let isTryingToCapture =
      board[index] !== PieceEnums.EMPTY
        ? currentPlayer === PlayerTypes.WHITE
          ? board[index] > 5
          : board[index] > 0 && board[index] < 6
        : false;

    if (
      checkMove(
        selectedLocation,
        index,
        currentPlayer,
        board
      )
    ) {
      return isTryingToCapture
        ? "outline outline-4 outline-offset-[-4px] outline-red-500"
        : "outline outline-4 outline-offset-[-4px] outline-green-500";
    }
  };

  return (
    <div
      className={`w-[12.5%] flex justify-center items-center 
      ${getCellColor(index)}  ${
        selectedLocation === index
          ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
          : ""
      } ${canMoveCheckerStyle()}`}
    >
      <p className="bg-green-300 text-xs">{index}</p>
      {children}
    </div>
  );
}
