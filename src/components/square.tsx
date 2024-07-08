import React from "react";
import { checkMove } from "../../utils/helpers";
import { PieceTypes, PlayerTypes } from "../../utils/enums";
import {
  SQUARE_HORIZONTAL_LABEL,
  SQUARE_VERTICAL_LABEL,
} from "../../utils/constants";
import { useDroppable } from "@dnd-kit/core";

interface SquareProps {
  index: number;
  gameState: any;
  children: React.ReactNode;
}

export default function Square({ index, children, gameState }: SquareProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${index}`,
    data: {
      index,
    },
  });

  const { selectedLocation, currentPlayer, board } = gameState;

  const getCellColor = React.useMemo(() => {
    const isEvenRow = Math.floor(index / 8) % 2 === 0;
    const isEvenCol = index % 2 === 0;
    const cellColor =
      (isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)
        ? "bg-white"
        : "bg-black";
    return cellColor;
  }, [index]);

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
      board[index] !== PieceTypes.EMPTY
        ? currentPlayer === PlayerTypes.WHITE
          ? board[index] > 6
          : board[index] > 0 && board[index] < 7
        : false;

    if (checkMove(selectedLocation, index, currentPlayer, board)) {
      return isTryingToCapture
        ? "outline outline-4 outline-offset-[-4px] outline-red-500"
        : "outline outline-4 outline-offset-[-4px] outline-green-500";
    }
  };


  return (
    <div
      ref={setNodeRef}
      className={`w-[12.5%] relative flex justify-center items-center 
      ${getCellColor}  ${
        selectedLocation === index
          ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
          : ""
      } ${canMoveCheckerStyle()} ${isOver ? "opacity-50" : ""}`}
    >
      <p className="bg-green-300 text-xs absolute top-0 right-1">{index}</p>
      {SQUARE_VERTICAL_LABEL[index] && (
        <p
          className={`text-lg font-bold absolute top-0 left-1 ${
            getCellColor == "bg-black" ? "text-white" : "text-black"
          }`}
        >
          {SQUARE_VERTICAL_LABEL[index]}
        </p>
      )}

      {SQUARE_HORIZONTAL_LABEL[index] && (
        <p
          className={`text-lg font-bold absolute bottom-0 right-1 ${
            getCellColor == "bg-black" ? "text-white" : "text-black"
          }`}
        >
          {SQUARE_HORIZONTAL_LABEL[index]}
        </p>
      )}

      {children}
    </div>
  );
}
