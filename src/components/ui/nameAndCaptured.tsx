import React from "react";
import { PieceTypes, PlayerTypes } from "../../../utils/enums";
import { isOpponentPiece } from "../../../utils/helpers";
import { PIECE_IMAGES } from "../../../utils/constants";

interface NameAndCapturedProps {
  playerType: PlayerTypes;
  capturedPieces: Array<PieceTypes>;
}

const NameAndCaptured: React.FC<NameAndCapturedProps> = ({
  playerType,
  capturedPieces,
}) => {
  const playerWiseCapturedPieces = capturedPieces?.filter((piece) =>
    isOpponentPiece(playerType, piece)
  );

  return (
    <div className="flex flex-col">
      <p className="text-sm">
        {playerType === PlayerTypes.WHITE ? "White Player" : "Black Player"}
      </p>
      <div className="flex">
        {playerWiseCapturedPieces?.length > 0 &&
          playerWiseCapturedPieces?.map((pieceKey : PieceTypes, index) => (
            <img
              className="w-5 h-5"
              key={index}
              src={PIECE_IMAGES[pieceKey]}
              alt="captured pieces"
            />
          ))}
        {/* {playerWiseCapturedPieces?.length > 0 && (
          <span className="text-xs">{playerWiseCapturedPieces?.length}</span>
        )} */}
      </div>
    </div>
  );
};

export default NameAndCaptured;
