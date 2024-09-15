import { PIECE_IMAGES } from "../../utils/constants";
import { PieceTypes } from "../../utils/enums";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface IPiece {
  pieceKey: PieceTypes;
  index: number;
}

export default function Piece({ pieceKey, index }: IPiece) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `droppable-${index}`,
    data: {
      index,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      className="w-[85%] h-[85%] cursor-pointer bg-no-repeat bg-center z-10"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        backgroundImage: pieceKey ? `url(${PIECE_IMAGES[pieceKey]})` : "none",
        backgroundSize: "contain",
      }}
    ></div>
  );
}
