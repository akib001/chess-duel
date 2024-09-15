// hooks/useChessAudio.ts
import { useRef, useCallback, useState } from "react";
import { GameHistory, GameState } from "../../utils/common.interface";
import { GameResult } from "../../utils/enums";

const audioFiles = {
  gameStart: "/game-start.mp3",
  gameEnd: "/game-end.mp3",
  capture: "/capture.mp3",
  castle: "/castle.mp3",
  premove: "/premove.mp3",
  moveSelf: "/move-self.mp3",
  moveOpponent: "/move-opponent.mp3",
  moveCheck: "/move-check.mp3",
  promote: "/promote.mp3",
  notify: "/notify.mp3",
  illegal: "/illegal.mp3",
  tenSeconds: "/tenseconds.mp3",
};

type AudioType = keyof typeof audioFiles;

export const useChessAudio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<{ [key in AudioType]?: HTMLAudioElement }>({});

  const playAudio = useCallback(
    (type: AudioType) => {
      if (isMuted) return;
      if (!audioRefs.current[type]) {
        audioRefs.current[type] = new Audio(audioFiles[type]);
      }
      audioRefs.current[type]?.play();
    },
    [isMuted]
  );

  const playMoveSound = useCallback(
    (lastMove: GameHistory, currentState: GameState) => {
      if (lastMove.capturedPiece) {
        playAudio("capture");
      } else if (lastMove.isCastling) {
        playAudio("castle");
      } else if (lastMove.isPromotion) {
        playAudio("promote");
      } else if (lastMove.isCheck) {
        playAudio("moveCheck");
      } else {
        playAudio("moveSelf");
      }
    },
    [playAudio]
  );

  const playGameResultSound = useCallback(
    (result: GameResult) => {
      if (
        result === GameResult.WHITE_WINS ||
        result === GameResult.BLACK_WINS ||
        result === GameResult.DRAW
      ) {
        playAudio("gameEnd");
      }
    },
    [playAudio]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { playAudio, playMoveSound, playGameResultSound, isMuted, toggleMute };
};
