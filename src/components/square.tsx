import React from "react";

interface SquareProps {
  x: number;
  y: number;
  children: React.ReactNode;
}

export default function Square({ x, y, children }: SquareProps) {
  const getCellColor = (rowIndex: number, cellIndex: number) => {
    if (rowIndex % 2 === 0) {
      if (cellIndex % 2 === 0) {
        return "bg-white";
      } else {
        return "bg-black";
      }
    } else {
      if (cellIndex % 2 === 0) {
        return "bg-black";
      } else {
        return "bg-white";
      }
    }
  };

  return (
    <div
      className={`w-[12.5%] 
      ${getCellColor(x, y)}`}
    >
      {children}
    </div>
  );
}
