import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { GameResult, GameStatus, PlayerTypes } from "../../../utils/enums";
import { on } from "events";

interface PropTypes {
  result: GameResult;
  status: GameStatus;
  onClose: () => void;
}

const GameOverModal: React.FC<PropTypes> = ({
  result,
  status,
  onClose,
}) => {
  const isOpen = result !== GameResult.ONGOING;

  const getResultMessage = () => {
    switch (result) {
      case GameResult.WHITE_WINS:
        return "White wins!";
      case GameResult.BLACK_WINS:
        return "Black wins!";
      case GameResult.DRAW:
        return "It's a draw!";
      default:
        return "Game Over";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case GameStatus.CHECKMATE:
        return `Checkmate! ${
          result === GameResult.WHITE_WINS ? "White" : "Black"
        } wins by checkmate.`;
      case GameStatus.STALEMATE:
        return "Stalemate! The game ends in a draw.";
      case GameStatus.TIMEOUT:
        return `Time's up! ${
          result === GameResult.WHITE_WINS ? "White" : "Black"
        } wins on time.`;
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-6 border bg-gray-900 p-8 text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center">
            {getResultMessage()}
          </h2>
          <p className="text-xl text-center">{getStatusMessage()}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Restart
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GameOverModal;
