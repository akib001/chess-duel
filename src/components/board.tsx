"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { FaPlay, FaUndo, FaPlus } from "react-icons/fa";
import gameReducer, { initialState } from "../../utils/gameReducer";
import Square from "./square";
import Piece from "./piece";
import {
  GameResult,
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
import PawnPromotionModal from "./ui/pawnPromotionModal";
import { useChessAudio } from "./useChessAudio";
import BottomBtn from "./ui/bottomBtn";
import { FaPause } from "react-icons/fa";
import { FaVolumeXmark } from "react-icons/fa6";
import { FaVolumeHigh } from "react-icons/fa6";

export default function Board() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const { playMoveSound, playGameResultSound, isMuted, toggleMute } =
    useChessAudio();
  const prevResultRef = useRef<GameResult>(initialState.result);
  const [gameHistoryIndex, setGameHistoryIndex] = useState<number | null>(null);
  const [openInitialModal, setOpenInitialModal] = useState(true);

  // TODO: useEffect is causing delay in sound
  useEffect(() => {
    const lastMove =
      gameState.gameHistories?.[gameState.gameHistories.length - 1];

    if (gameState.result !== prevResultRef.current) {
      playGameResultSound(gameState.result);
      prevResultRef.current = gameState.result;
    } else if (lastMove) {
      playMoveSound(lastMove, gameState);
    }
  }, [gameState?.gameHistories, gameState.result]);

  function isPawnPromotion(): boolean {
    const lastMove =
      gameState.gameHistories?.[gameState.gameHistories.length - 1];

    if (
      lastMove &&
      (lastMove.piece === PieceTypes.WHITE_PAWN ||
        lastMove.piece === PieceTypes.BLACK_PAWN) &&
      (lastMove.to <= 8 || lastMove.to >= 56) &&
      gameState.capturedPieces.length > 0
    ) {
      return true;
    }

    return false;
  }

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
    if (gameHistoryIndex !== null) {
      setGameHistoryIndex(null);
      return;
    }
    const index = e.active.data?.current?.index;
    if (index === undefined) return;
  };

  const dragEndHandler = (e: DragEndEvent) => {
    if (gameHistoryIndex !== null) {
      setGameHistoryIndex(null);
      return;
    }

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
      selectedLocation !== null &&
      isClick &&
      isPlayerPiece(currentPlayer, selectedPiece)
    ) {
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

  const handlePawnPromotion = (piece?: PieceTypes) => {
    dispatch({ type: actionTypes.PAWN_PROMOTION, payload: piece });
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
                (gameState.status === GameStatus.ONGOING ||
                  gameState.status === GameStatus.CHECK) &&
                !gameState.isPaused
              }
              currentPlayer={gameState.currentPlayer}
              onTimeUp={handleTimeUp}
              result={gameState.result}
            />
          </div>

          <div className="w-full aspect-square flex flex-wrap border-2 border-white">
            {(gameHistoryIndex !== null && gameHistoryIndex >= 0
              ? gameState.gameHistories[gameHistoryIndex]
              : gameState
            )?.board.map((item: PieceTypes, i: number) => (
              <Square key={`${item}-${i}`} index={i} gameState={gameState} pieceKey={item}>
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
                (gameState.status === GameStatus.ONGOING ||
                  gameState.status === GameStatus.CHECK) &&
                !gameState.isPaused
              }
              currentPlayer={gameState.currentPlayer}
              onTimeUp={handleTimeUp}
              result={gameState.result}
            />
          </div>
        </div>

        <div className="col-span-7 md:col-span-3">
          <div className="bg-[#262421] rounded-lg h-[calc(100%-45px)] overflow-auto">
            <HistoryTable
              gameHistories={gameState.gameHistories}
              gameHistoryIndex={gameHistoryIndex}
              onChangeHistory={onChangeHistory}
            />
            <div className="bg-black/15 grid grid-cols-4 gap-2 px-5 py-4">
              <BottomBtn
                onClick={handleGameOverModalClose}
                title="New Game"
                icon={<FaPlus />}
              />
              <BottomBtn onClick={onClickUndo} title="Undo" icon={<FaUndo />} />
              <BottomBtn
                onClick={handleTogglePause}
                title={gameState.isPaused ? "play" : "Pause"}
                icon={gameState.isPaused ? <FaPlay /> : <FaPause />}
              />
              <BottomBtn
                title={isMuted ? "Volume" : "Mute"}
                onClick={toggleMute}
                icon={isMuted ? <FaVolumeHigh /> : <FaVolumeXmark />}
              />
            </div>
          </div>
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
      {isPawnPromotion() && (
        <PawnPromotionModal
          onHandlePawnPromotion={handlePawnPromotion}
          capturedPieces={gameState.capturedPieces}
          currentPlayer={gameState.currentPlayer}
        />
      )}
    </DndContext>
  );
}
