import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface propTypes {
  isOpen: boolean;
  onStartNewGame: () => void;
  onStartTimedNewGame: () => void;
}

const InitialModal: React.FC<propTypes> = ({
  isOpen,
  onStartNewGame,
  onStartTimedNewGame,
}) => {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-6 border bg-gray-900 p-8 text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center">Welcome to Chess!</h2>
          <h2 className="text-lg font-bold text-center">2 Player Games</h2>
          <div className="flex flex-col gap-4 justify-center">
            <button
              onClick={onStartTimedNewGame}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mx-auto"
            >
              10 Minute Blitz
            </button>
            <button
              onClick={onStartNewGame}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mx-auto"
            >
              Classic Game
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InitialModal;
