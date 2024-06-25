"use client";
import { useReducer, useState } from "react";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import { PieceTypes, PlayerTypes, actionTypes } from "../../utils/enums";
import HistoryTable from "./historyTable";
import { MoveHistory } from "../../utils/common.interface";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [board, setBoard] = useState<Array<PieceTypes>>(gameState.board);

  const handlePieceSelection = (index: number) => {
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
    if (index > 0 || index < gameState.gameHistory.length) {
      setBoard(gameState.gameHistory[index].board);
    }
  };

  return (
    <>
      <div>
        Current Player:{" "}
        {gameState?.currentPlayer == PlayerTypes.WHITE ? "White" : "Black"}
      </div>
      <div className="w-[600px] h-[600px] flex flex-wrap border-2 border-white">
        {gameState?.board.map((item, i) => (
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
        gameHistory={gameState?.gameHistory}
        onChangeHistory={onChangeHistory}
      />
    </>
  );
}
