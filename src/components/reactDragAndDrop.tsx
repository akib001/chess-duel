"use client";
import { useState } from "react";

const DragAndDrop = () => {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onDrop = (e, index) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (draggedIndex !== index) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);

      setItems(newItems);
    }

    setDragOverIndex(null);
  };

  return (
    <div className="p-4">
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`bg-white p-4 border rounded shadow cursor-move ${
              dragOverIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DragAndDrop;
