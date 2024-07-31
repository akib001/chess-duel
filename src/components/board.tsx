"use client";
import { useCallback, useReducer, useState } from "react";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import {
  GameStatus,
  PieceTypes,
  PlayerTypes,
  actionTypes,
} from "../../utils/enums";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { isPlayerPiece } from "../../utils/helpers";
import HistoryTable from "./historyTable";
import PlayerAvatar from "./ui/playerAvatar";
import NameAndCaptured from "./ui/nameAndCaptured";
import Timer from "./ui/timer";
import InitialModal from "./ui/initialModal";
import GameOverModal from "./ui/gameOverModal";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const [gameHistoryIndex, setGameHistoryIndex] = useState<number | null>(null);
  const [openInitialModal, setOpenInitialModal] = useState(true);

  console.log('gamestate-->', gameState)

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
    // console.log("drag start", index);
    if (index === undefined) return;
  };

  const dragEndHandler = (e: DragEndEvent) => {
    const startDragIndex = e.active.data?.current?.index;
    const endDragIndex = e.over?.data?.current?.index;
    if (startDragIndex === undefined || endDragIndex === undefined) {
      return;
    }
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
      dispatch({
        type: actionTypes.MOVE_PIECE,
        payload: { startIndex: startDragIndex, endIndex: endDragIndex },
      });
    } else {
      dispatch({ type: actionTypes.SELECT_PIECE, payload: null });
    }
  };

  const handleTimeUp = useCallback(() => {
    dispatch({ type: actionTypes.TIME_UP });
  }, []);

  const handleTogglePause = () => {
    dispatch({ type: actionTypes.TOGGLE_PAUSE });
  };

  const handleInitialModalClose = () => {
    setOpenInitialModal(false);
    handleTogglePause();
  };

  const handleGameOverModalClose = () => {
    dispatch({ type: actionTypes.RESET });
  };

  return (
    <DndContext onDragEnd={dragEndHandler} onDragStart={handleDragStart}>
      <div className="grid grid-cols-7 gap-4 w-full py-4">
        <div className="col-span-7 md:col-span-4 space-y-4">
          <div className="col-span-7 md:col-span-4 flex justify-between">
            <div className="flex gap-2">
              <PlayerAvatar playerType={PlayerTypes.BLACK} />
              <NameAndCaptured
                playerType={PlayerTypes.BLACK}
                capturedPieces={gameState.capturedPieces}
              />
            </div>
            <Timer
              playerType={PlayerTypes.BLACK}
              initialTime={gameState.blackTimer}
              isRunning={
                gameState.currentPlayer === PlayerTypes.BLACK &&
                gameState.status === GameStatus.ONGOING &&
                !gameState.isPaused
              }
              currentPlayer={gameState.currentPlayer}
              onTimeUp={handleTimeUp}
            />
          </div>

          <div className="w-full aspect-square flex flex-wrap border-2 border-white">
            {(gameHistoryIndex !== null && gameHistoryIndex >= 0
              ? gameState.gameHistories[gameHistoryIndex] 
              : gameState
            )?.board.map((item: PieceTypes, i: number) => (
              <Square key={`${item}-${i}`} index={i} gameState={gameState}>
                <Piece pieceKey={item} index={i} />
              </Square>
            ))}
          </div>
          <div className="col-span-7 md:col-span-4 flex justify-between">
            <div className="flex gap-2">
              <PlayerAvatar playerType={PlayerTypes.WHITE} />
              <NameAndCaptured
                playerType={PlayerTypes.WHITE}
                capturedPieces={gameState.capturedPieces}
              />
            </div>
            <Timer
              playerType={PlayerTypes.WHITE}
              initialTime={gameState.blackTimer}
              isRunning={
                gameState.currentPlayer === PlayerTypes.WHITE &&
                gameState.status === GameStatus.ONGOING &&
                !gameState.isPaused
              }
              currentPlayer={gameState.currentPlayer}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        <div className="col-span-7 md:col-span-3">
          <HistoryTable
            gameHistories={gameState.gameHistories}
            onChangeHistory={onChangeHistory}
          />
        </div>
      </div>
      <InitialModal
        isOpen={openInitialModal}
        onClose={handleInitialModalClose}
      />
      <GameOverModal
        result={gameState.result}
        status={gameState.status}
        onClose={handleGameOverModalClose}
      />
    </DndContext>
  );
}
