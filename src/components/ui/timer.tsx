import React, { useEffect, useState } from "react";
import { PlayerTypes } from "../../../utils/enums";

interface TimerProps {
  playerType: PlayerTypes;
  initialTime: number;
  isRunning: boolean;
  currentPlayer: PlayerTypes;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({
  playerType,
  initialTime,
  isRunning,
  currentPlayer,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  //TODO: after restart clock is not reset
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const backgroundColor =
    playerType === currentPlayer ? "bg-white text-black" : "bg-[#262421]";

  return (
    <div className={`${backgroundColor} px-2 py-2 rounded-sm`}>{formatTime(timeLeft)}</div>
  );
};

export default React.memo(Timer);
