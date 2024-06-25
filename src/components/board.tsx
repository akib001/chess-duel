"use client";
import { useReducer, useState } from "react";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import { PieceTypes, PlayerTypes, actionTypes } from "../../utils/enums";
import HistoryTable from "./historyTable";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [gameHistoryIndex, setGameHistoryIndex] = useState<number | null>(null);

  const handlePieceSelection = (index: number) => {
    if (gameHistoryIndex !== null) {
      setGameHistoryIndex(null);
      return;
    }
    const selectedLocation = gameState.selectedLocation;
    const currentPlayer = gameState.currentPlayer;
    const selectedPiece = gameState.board[index];

    if (selectedLocation !== null && selectedLocation !== index) {
      dispatch({ type: actionTypes.MOVE_PIECE, payload: index });
    } else if (
      selectedLocation === null &&
      selectedPiece &&
      ((currentPlayer === PlayerTypes.WHITE &&
        selectedPiece > 0 &&
        selectedPiece < 7) ||
        (currentPlayer == PlayerTypes.BLACK && selectedPiece > 6))
    ) {
      dispatch({ type: actionTypes.SELECT_PIECE, payload: index });
    } else {
      dispatch({ type: actionTypes.SELECT_PIECE, payload: null });
    }
  };

  const onChangeHistory = (index: number) => {
    setGameHistoryIndex(index);
  };

  const onClickUndo = () => {
    if (gameHistoryIndex !== null) {
      setGameHistoryIndex(null);
      return;
    }
    dispatch({ type: actionTypes.UNDO_MOVE });
  };

  return (
    <>
      <div>
        <div>
          Current Player:{" "}
          {gameState?.currentPlayer == PlayerTypes.WHITE ? "White" : "Black"}
        </div>
        <button onClick={onClickUndo}>Undo</button>
      </div>
      <div className="w-[600px] h-[600px] flex flex-wrap border-2 border-white">
        {(gameHistoryIndex !== null
          ? gameState.gameHistories[gameHistoryIndex]
          : gameState
        )?.board.map((item: PieceTypes, i: number) => (
          <Square key={`${item}-${i}`} index={i} gameState={gameState}>
            <Piece
              pieceKey={item}
              index={i}
              onSelectedPiece={handlePieceSelection}
            />
          </Square>
        ))}
      </div>
      <HistoryTable
        gameHistories={gameState.gameHistories}
        onChangeHistory={onChangeHistory}
      />
    </>
  );
}
