"use client";
import { useReducer, useState } from "react";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import { PieceTypes, PlayerTypes, actionTypes } from "../../utils/enums";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { isPlayerPiece } from "../../utils/helpers";
import HistoryTable from "./historyTable";
import { GameHistory } from "../../utils/common.interface";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [gameHistoryIndex, setGameHistoryIndex] = useState<number | null>(null);

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

  const handleDragStart = (e: DragStartEvent) => {
    const index = e.active.data?.current?.index;
    console.log("drag start", index);
    if (index === undefined) return;
  };

  const dragEndHandler = (e: DragEndEvent) => {
    const startDragIndex = e.active.data?.current?.index;
    const endDragIndex = e.over?.data?.current?.index;
    if (startDragIndex === undefined || endDragIndex === undefined) {
      return;
    }

    console.log("drag end", endDragIndex);

    const currentPlayer = gameState.currentPlayer;
    const selectedLocation = gameState.selectedLocation;
    const selectedPiece = gameState.board[selectedLocation];
    const isClick = startDragIndex == endDragIndex;
    const dragEndPiece = gameState.board[endDragIndex];

    if (
      selectedLocation == null &&
      isClick &&
      isPlayerPiece(currentPlayer, dragEndPiece)
    ) {
      dispatch({ type: actionTypes.SELECT_PIECE, payload: endDragIndex });
    } else if (selectedLocation && !isClick) {
      // console.log("selected and then try to drag to another location");
      dispatch({
        type: actionTypes.MOVE_PIECE,
        payload: { startIndex: startDragIndex, endIndex: endDragIndex },
      });
    } else if (isClick && selectedLocation == endDragIndex) {
      // console.log("isClick and selected piece is the same");
      dispatch({ type: actionTypes.SELECT_PIECE, payload: null });
    } else if (
      selectedLocation &&
      isClick &&
      isPlayerPiece(currentPlayer, selectedPiece)
    ) {
      // console.log("move by isClick");

      if (isPlayerPiece(currentPlayer, dragEndPiece)) {
        // console.log("selecting another own piece");
        dispatch({ type: actionTypes.SELECT_PIECE, payload: endDragIndex });
        return;
      }

      dispatch({
        type: actionTypes.MOVE_PIECE,
        payload: { startIndex: selectedLocation, endIndex: endDragIndex },
      });
    } else if (
      selectedLocation == null &&
      !isClick &&
      isPlayerPiece(currentPlayer, gameState.board[startDragIndex])
    ) {
      // move piece
      // console.log("select piece by drag");
      dispatch({
        type: actionTypes.MOVE_PIECE,
        payload: { startIndex: startDragIndex, endIndex: endDragIndex },
      });
    } else {
      // console.log("else case");
      dispatch({ type: actionTypes.SELECT_PIECE, payload: null });
    }
  };

  return (
    <DndContext onDragEnd={dragEndHandler} onDragStart={handleDragStart}>
      <div>
        <div>
          Current Player:{" "}
          {gameState?.currentPlayer == PlayerTypes.WHITE ? "White" : "Black"}
        </div>
        <button onClick={onClickUndo}>Undo</button>
      </div>
      <div className="w-[600px] h-[600px] flex flex-wrap border-2 border-white">
        {(gameHistoryIndex !== null && gameHistoryIndex >= 0 
          ? gameState.gameHistories[gameHistoryIndex]
          : gameState
        )?.board.map((item: PieceTypes, i: number) => (
          <Square key={`${item}-${i}`} index={i} gameState={gameState}>
            <Piece pieceKey={item} index={i} />
          </Square>
        ))}
      </div>
      {/* <HistoryTable
        gameHistories={gameState.gameHistories}
        onChangeHistory={onChangeHistory}
      /> */}
    </DndContext>
  );
}
