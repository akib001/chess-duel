interface IPiece {
  pieceKey: any;
  x: number;
  y: number;
  selectedPiece: null | Array<number>;
  onSelectedPiece: (coordinates: null | Array<number>) => void;
  board: Array<Array<string>>;
  setBoard: (board: Array<Array<string>>) => void;
}

export default function Piece({
  pieceKey,
  x,
  y,
  selectedPiece,
  onSelectedPiece,
  board,
  setBoard,
}: IPiece) {
  const checkPawnMoves = (
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
    playerType: number,
    isTryingToCapture = false
  ) => {
    const multi = playerType == 0 ? -1 : 1;

    let rowDiff = multi * (startRow - endRow);
    let colDiff = Math.abs(startCol - endCol);

    if (isTryingToCapture && colDiff == 1 && rowDiff == 1) {
      return true;
    } else if (colDiff > 0) {
      console.log("can not go horizontal");
      return false;
    } else {
      if (rowDiff < 0) {
        console.log("can not go backward");
        return false;
      }
      // 1st time
      if (startRow == 1 || startRow == 6) {
        // overlapping another piece
        if (rowDiff > 2) {
          return false;
        } else if (board[startRow + multi * -1][startCol]) {
          console.log("another piece exist in the path");
          return false;
        }
      } else {
        if (rowDiff > 1) {
          return false;
        }
      }
    }

    return true;
  };

  const pieceSelectHandler = () => {
    if (selectedPiece === null) {
      onSelectedPiece([x, y]);
    } else {
      if (
        checkPawnMoves(
          selectedPiece[0],
          selectedPiece[1],
          x,
          y,
          board[selectedPiece[0]][selectedPiece[1]][0] == "w" ? 0 : 1
        )
      ) {
        const newBoard = board.map((row) => [...row]);
        newBoard[x][y] = board[selectedPiece[0]][selectedPiece[1]];
        newBoard[selectedPiece[0]][selectedPiece[1]] = "";
        setBoard(newBoard);
      }
      onSelectedPiece(null);
    }
  };

  return (
    <div
      className={`text-green-600 h-full w-full flex items-center justify-center ${
        selectedPiece && selectedPiece[0] == x && selectedPiece[1] == y
          ? "bg-slate-600"
          : ""
      }`}
      onClick={pieceSelectHandler}
    >
      {pieceKey}
    </div>
  );
}
