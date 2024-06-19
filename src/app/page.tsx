import { board } from "../../utils/app";

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

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-8 rounded-sm border-2 border-white p-4 mx-auto mt-10 max-w-[1000px]">
        {board.map((row, rowIndex) => (
          <>
            {board[rowIndex].map((cell, cellIndex) => (
              <div
                key={`${cell}-${cellIndex}`}
                className={`h-28 ${getCellColor(rowIndex, cellIndex)}`}
              />
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
