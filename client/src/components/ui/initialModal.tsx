import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface propTypes {
  isOpen: boolean;
  onClose: () => void;
}

const InitialModal: React.FC<propTypes> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-6 border bg-gray-900 p-8 text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center">Welcome to Chess!</h2>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors mx-auto"
            >
              Start 2 Player Game
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InitialModal;