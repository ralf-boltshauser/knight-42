"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./badge";

export type Column = {
  id: string;
  title: string;
  color: string;
  cards: Card[];
};

export type Card = {
  id: string;
  title: string;
  color: string;
  tailText: React.ReactNode;
  link: string;
};

export default function KanbanBoard({
  columns: initialColumns,
  onUpdate,
}: {
  columns: Column[];
  onUpdate: (columnId: string, cardId: string) => void;
}) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);

  const onDragStart = (card: Card, columnId: string) => {
    setDraggingCard(card);
    setSourceColumnId(columnId);
  };

  const onDragEnd = () => {
    setDraggingCard(null);
    setSourceColumnId(null);
  };

  const onDrop = (destinationColumnId: string) => {
    if (!draggingCard || sourceColumnId === null) return;
    if (sourceColumnId === destinationColumnId) return;

    setColumns((prev) =>
      prev.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== draggingCard.id),
          };
        }
        if (column.id === destinationColumnId) {
          return {
            ...column,
            cards: [...column.cards, draggingCard],
          };
        }
        return column;
      })
    );

    onUpdate(destinationColumnId, draggingCard.id);

    setDraggingCard(null);
    setSourceColumnId(null);
  };

  return (
    <div className="flex gap-8 w-full">
      {columns.map((column) => (
        <div
          key={column.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(column.id)}
          className="flex-1 p-4 border rounded flex flex-col gap-2"
        >
          <Badge
            variant="outline"
            className={`w-fit bg-${column.color}-300 border-${column.color}-800`}
          >
            {column.title}
          </Badge>
          <div className="min-h-[200px] flex flex-col gap-2">
            {column.cards.map((card) => (
              <Link href={card.link} key={card.id} passHref legacyBehavior>
                <motion.div
                  draggable
                  onMouseDown={() => onDragStart(card, column.id)}
                  onDragStart={() => onDragStart(card, column.id)}
                  onDragEnd={onDragEnd}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 bg-white border rounded shadow cursor-grab flex flex-col gap-2 xl:flex-row justify-between border-${card.color}-500`}
                >
                  <span className="">{card.title}</span>
                  <div className="text-xs mt-0 xl:mt-1 text-gray-500">
                    {card.tailText}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
