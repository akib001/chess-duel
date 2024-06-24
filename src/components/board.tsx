"use client";;
import { useReducer } from "react";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import { PlayerTypes, actionTypes } from "../../utils/enums";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

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
      {/* <HistoryTable gameHistory={gameState?.gameHistory} /> */}
    </>
  );
}
