import Image from "next/image";
import { PIECE_IMAGES } from "../../utils/constants";
import { PieceTypes } from "../../utils/enums";

interface IPiece {
  pieceKey: PieceTypes;
  index: number;
  onSelectedPiece: any;
}

export default function Piece({ pieceKey, index, onSelectedPiece }: IPiece) {
  const onDragStart = (e) => {
    const img = new Image();
    img.src = PIECE_IMAGES[pieceKey];``
    e.dataTransfer.setDragImage(img, 32, 32);
    console.log("drag start", index);
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
    onSelectedPiece(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    console.log("on Drop index", index);
    e.preventDefault();

    onSelectedPiece(index);
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
  };

  return (
    <>
      <div
        className="w-16 h-16 cursor-pointer bg-no-repeat bg-center"
        style={{
          backgroundImage: pieceKey ? `url(${PIECE_IMAGES[pieceKey]})` : "none",
          backgroundSize: "64px 64px",
        }}
        onClick={() => {
          console.log("onClick");
          onSelectedPiece(index);
        }}
        draggable={!!pieceKey}
        onDragStart={(e) => pieceKey && onDragStart(e)}
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e)}
      ></div>
    </>
  );
}
