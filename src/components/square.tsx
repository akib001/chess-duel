import React from "react";
import { checkMove, isOpponentPiece, isPlayerPiece } from "../../utils/helpers";
import { PieceTypes } from "../../utils/enums";
import {
  SQUARE_HORIZONTAL_LABEL,
  SQUARE_VERTICAL_LABEL,
} from "../../utils/constants";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { GameState } from "../../utils/common.interface";

interface SquareProps {
  index: number;
  gameState: GameState;
  children: React.ReactNode;
}

export default function Square({ index, children, gameState }: SquareProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${index}`,
    data: {
      index,
    },
  });

  const { currentPlayer, selectedLocation, board } = gameState;

  const dndContext = useDndContext();
  const currSelectedLocation =
    dndContext.active?.data?.current?.index ?? selectedLocation;

  const isLightSquare = (Math.floor(index / 8) % 2 === 0) === (index % 2 === 0);

  const legalMovesComponent = () => {
    if (currSelectedLocation == undefined) {
      return "";
    }

    // can not capture own piece
    if (isPlayerPiece(gameState.currentPlayer, board[index])) {
      return "";
    }

    // can not move other player's piece
    if (isOpponentPiece(gameState.currentPlayer, board[currSelectedLocation])) {
      return "";
    }

    let isTryingToCapture =
      board[index] !== PieceTypes.EMPTY
        ? isOpponentPiece(currentPlayer, board[index])
        : false;

    if (checkMove(currSelectedLocation, index, currentPlayer, board)) {
      return isTryingToCapture ? (
        <div
        className={`w-full h-full m-1 absolute bg-transparent 
        ${isLightSquare ? "border-black" : "border-white"} 
        border-8 border-opacity-20 rounded-full animate-pulse`}
      />
      ) : (
        <div
          className={`w-7 h-7 absolute ${
            isLightSquare ? "bg-black" : "bg-white"
          } opacity-20 rounded-full`}
        />
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`h-[12.5%] w-[12.5%] relative flex justify-center items-center 
      ${isLightSquare ? "bg-white" : "bg-black"}  ${
        currSelectedLocation === index
          ? "outline outline-4 outline-offset-[-4px] outline-blue-500"
          : ""
      } ${isOver ? "opacity-50" : ""}`}
    >
      <p className="bg-green-300 text-xs absolute top-0 right-1 text-black">{index}</p>
      {SQUARE_VERTICAL_LABEL[index] && (
        <p
          className={`text-sm font-bold absolute top-0 left-1 lg:text-lg ${
            isLightSquare ? "text-black" : "text-white"
          }`}
        >
          {SQUARE_VERTICAL_LABEL[index]}
        </p>
      )}

      {SQUARE_HORIZONTAL_LABEL[index] && (
        <p
          className={`text-sm font-bold absolute bottom-0 right-1 lg:text-lg ${
            isLightSquare ? "text-black" : "text-white"
          }`}
        >
          {SQUARE_HORIZONTAL_LABEL[index]}
        </p>
      )}

      {legalMovesComponent()}

      {children}
    </div>
  );
}
