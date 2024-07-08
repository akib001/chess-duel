import Image from "next/image";
import { PIECE_IMAGES } from "../../utils/constants";
import { PieceTypes } from "../../utils/enums";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface IPiece {
  pieceKey: PieceTypes;
  index: number;
  onSelectedPiece: any;
}

export default function Piece({ pieceKey, index, onSelectedPiece }: IPiece) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `droppable-${index}`,
  });

  const onDragStart = (e) => {
    const img = new Image();
    img.src = PIECE_IMAGES[pieceKey];
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

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <div
        className="w-16 h-16 cursor-pointer bg-no-repeat bg-center"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          ...style,
          backgroundImage: pieceKey ? `url(${PIECE_IMAGES[pieceKey]})` : "none",
          backgroundSize: "64px 64px",
        }}
        onClick={() => {
          onSelectedPiece(index);
        }}
        // draggable={!!pieceKey}
        // onDragStart={(e) => pieceKey && onDragStart(e)}
        // onDragOver={(e) => onDragOver(e)}
        // onDrop={(e) => onDrop(e)}
      ></div>
    </>
  );
}
