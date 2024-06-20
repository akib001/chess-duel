"use client";
import React, { useState } from "react";
import { board as initialBoard } from "../../utils/helpers";
import Piece from "./piece";
import Square from "./square";

export default function Board() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<Array<number> | null>(
    null
  );

  return (
    <div className="w-[600px] h-[600px] flex flex-wrap border-2 border-white">
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {board[rowIndex].map((cell, cellIndex) => (
            <Square key={`${cell}-${cellIndex}`} x={rowIndex} y={cellIndex}>
              <Piece
                pieceKey={cell}
                selectedPiece={selectedPiece}
                onSelectedPiece={setSelectedPiece}
                x={rowIndex}
                y={cellIndex}
                board={board}
                setBoard={setBoard}
              />
            </Square>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
