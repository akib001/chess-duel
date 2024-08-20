import React, { useEffect, useState } from "react";
import { PlayerTypes } from "../../../utils/enums";

interface TimerProps {
  playerType: PlayerTypes;
  initialTime: number;
  isRunning: boolean;
  currentPlayer: PlayerTypes;
  onTimeUp: () => void;
  resetTimer: boolean;
  isTimeIncreasing: boolean;
}

const Timer: React.FC<TimerProps> = ({
  playerType,
  initialTime,
  isRunning,
  currentPlayer,
  onTimeUp,
  resetTimer,
  isTimeIncreasing
}) => {
  const [timeLeft, setTimeLeft] = useState(() => initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, resetTimer]);



  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const addAmount = isTimeIncreasing ? 1 : -1;

    if (isRunning && ((!isTimeIncreasing && timeLeft > 0) || isTimeIncreasing)) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1 && !isTimeIncreasing) {
            if (interval) clearInterval(interval);
            onTimeUp();
            return 0;
          }
          return prevTime + addAmount;
        });
      }, 1000);
    } else if (!isRunning && interval && !isTimeIncreasing) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onTimeUp, isTimeIncreasing]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const backgroundColor =
    playerType === currentPlayer ? "bg-white text-black" : "bg-[#262421]";

  return (
    <div className={`${backgroundColor} px-2 py-2 rounded-sm w-14 text-center`}>
      {formatTime(timeLeft)}
    </div>
  );
};

export default React.memo(Timer);
