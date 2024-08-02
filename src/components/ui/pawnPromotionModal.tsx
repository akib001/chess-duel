import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PieceTypes, PlayerTypes } from "../../../utils/enums";
import { isOpponentPiece } from "../../../utils/helpers";
import { PIECE_IMAGES } from "../../../utils/constants";

const PROMOTION_PIECES = new Set([
  PieceTypes.WHITE_QUEEN,
  PieceTypes.WHITE_ROOK,
  PieceTypes.WHITE_BISHOP,
  PieceTypes.WHITE_KNIGHT,
  PieceTypes.BLACK_QUEEN,
  PieceTypes.BLACK_ROOK,
  PieceTypes.BLACK_BISHOP,
  PieceTypes.BLACK_KNIGHT,
]);

interface propTypes {
  onClose: (piece?: PieceTypes) => void;
  capturedPieces: PieceTypes[];
  currentPlayer: PlayerTypes;
}

const PawnPromotionModal: React.FC<propTypes> = ({
  onClose,
  capturedPieces,
  currentPlayer,
}) => {
  const playerWisePromotionPieces = Array.from(new Set(capturedPieces)).filter(
    (piece) =>
      isOpponentPiece(currentPlayer, piece) && PROMOTION_PIECES.has(piece)
  );

  if (!playerWisePromotionPieces || playerWisePromotionPieces.length === 0) {
    return null;
  }

  return (
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-6 border bg-gray-900 p-8 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Promote your pawn</h2>
          <div className="flex justify-center flex-wrap">
            {playerWisePromotionPieces?.map((pieceKey: PieceTypes, index) => (
              <img
                className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform"
                key={index}
                src={PIECE_IMAGES[pieceKey]}
                alt="captured pieces"
              />
            ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PawnPromotionModal;
