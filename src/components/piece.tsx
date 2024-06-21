import Image from "next/image";
import { PIECE_IMAGES } from "../../utils/constants";
import { Piece as PieceEnums } from "../../utils/enums";

interface IPiece {
  pieceKey: PieceEnums;
  index: number;
  onSelectedPiece: any;
}

export default function Piece({ pieceKey, index, onSelectedPiece }: IPiece) {
  // const checkPawnMoves = (
  //   startRow: number,
  //   startCol: number,
  //   endRow: number,
  //   endCol: number,
  //   playerType: number,
  //   isTryingToCapture = false
  // ) => {
  //   const multi = playerType == 0 ? -1 : 1;

  //   let rowDiff = multi * (startRow - endRow);
  //   let colDiff = Math.abs(startCol - endCol);

  //   if (isTryingToCapture && colDiff == 1 && rowDiff == 1) {
  //     return true;
  //   } else if (colDiff > 0) {
  //     console.log("can not go horizontal");
  //     return false;
  //   } else {
  //     if (rowDiff < 0) {
  //       console.log("can not go backward");
  //       return false;
  //     }
  //     // 1st time
  //     if (startRow == 1 || startRow == 6) {
  //       // overlapping another piece
  //       if (rowDiff > 2) {
  //         return false;
  //       } else if (board[startRow + multi * -1][startCol]) {
  //         console.log("another piece exist in the path");
  //         return false;
  //       }
  //     } else {
  //       if (rowDiff > 1) {
  //         return false;
  //       }
  //     }
  //   }

  //   return true;
  // };

  // const pieceSelectHandler = () => {
  //   if (selectedPiece === null) {
  //     onSelectedPiece([x, y]);
  //   } else {
  //     if (
  //       checkPawnMoves(
  //         selectedPiece[0],
  //         selectedPiece[1],
  //         x,
  //         y,
  //         board[selectedPiece[0]][selectedPiece[1]][0] == "w" ? 0 : 1
  //       )
  //     ) {
  //       const newBoard = board.map((row) => [...row]);
  //       newBoard[x][y] = board[selectedPiece[0]][selectedPiece[1]];
  //       newBoard[selectedPiece[0]][selectedPiece[1]] = "";
  //       setBoard(newBoard);
  //     }
  //     onSelectedPiece(null);
  //   }
  // };

  // ${
  //   selectedPiece && selectedPiece[0] == x && selectedPiece[1] == y
  //     ? "bg-slate-600"
  //     : ""
  // }

  return (
    <>
      {pieceKey ? (
        <Image
          src={PIECE_IMAGES[pieceKey]}
          width={64}
          height={64}
          alt={"chess piece"}
          className="cursor-pointer"
          onClick={() => onSelectedPiece(index)}
        />
      ) : (
        <div
          className="w-16 h-16 cursor-pointer"
          onClick={() => onSelectedPiece(index)}
        ></div>
      )}
    </>
  );
}
