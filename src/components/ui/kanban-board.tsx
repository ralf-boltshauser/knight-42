"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [arrowKeysEnabled, setArrowKeysEnabled] = useState(false);

  const onDragStart = (card: Card, columnId: string) => {
    setDraggingCard(card);
    setSourceColumnId(columnId);
  };

  const onDragEnd = () => {
    setDraggingCard(null);
    setSourceColumnId(null);
  };

  const onDrop = useCallback(
    (destinationColumnId: string) => {
      console.log("onDrop", draggingCard, sourceColumnId, destinationColumnId);
      if (!draggingCard && !sourceColumnId) {
        // Handle keyboard movement case
        const currentCard =
          columns[selectedColumnIndex]?.cards[selectedCardIndex];
        if (!currentCard) return;

        setColumns((prev) =>
          prev.map((column) => {
            if (column.id !== destinationColumnId) {
              return {
                ...column,
                cards: column.cards.filter(
                  (card) => card.id !== currentCard.id
                ),
              };
            }
            if (column.id === destinationColumnId) {
              return {
                ...column,
                cards: [...column.cards, currentCard],
              };
            }
            return column;
          })
        );

        if (currentCard) {
          onUpdate(destinationColumnId, currentCard.id);
        }

        setSelectedColumnIndex(
          columns.findIndex((column) => column.id === destinationColumnId)
        );
        setSelectedCardIndex(
          columns.find((column) => column.id === destinationColumnId)?.cards
            .length || 0
        );
      } else {
        // Handle drag and drop case
        if (!draggingCard || sourceColumnId === null) return;

        if (sourceColumnId === destinationColumnId) return;

        setColumns((prev) =>
          prev.map((column) => {
            if (column.id === sourceColumnId) {
              return {
                ...column,
                cards: column.cards.filter(
                  (card) => card.id !== draggingCard.id
                ),
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

        if (draggingCard) {
          onUpdate(destinationColumnId, draggingCard.id);
        }
      }

      setDraggingCard(null);
      setSourceColumnId(null);
    },
    [
      draggingCard,
      sourceColumnId,
      columns,
      selectedColumnIndex,
      selectedCardIndex,
      onUpdate,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setArrowKeysEnabled(true);
          setSelectedCardIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setArrowKeysEnabled(true);
          setSelectedCardIndex((prev) =>
            Math.min(columns[selectedColumnIndex]?.cards.length - 1, prev + 1)
          );
          break;
        case "ArrowLeft":
          e.preventDefault();
          setArrowKeysEnabled(true);
          if (e.shiftKey) {
            // Move card to previous column
            console.log("ArrowLeft");
            const card = columns[selectedColumnIndex]?.cards[selectedCardIndex];
            const prevColumnId = columns[selectedColumnIndex - 1]?.id;
            console.log(card, prevColumnId);
            if (card && prevColumnId) {
              onDrop(prevColumnId);
            }
          } else {
            setSelectedColumnIndex((prev) => Math.max(0, prev - 1));
            setSelectedCardIndex(0);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          setArrowKeysEnabled(true);
          if (e.shiftKey) {
            // Move card to next column
            const card = columns[selectedColumnIndex]?.cards[selectedCardIndex];
            const nextColumnId = columns[selectedColumnIndex + 1]?.id;
            if (card && nextColumnId) {
              onDrop(nextColumnId);
            }
          } else {
            setSelectedColumnIndex((prev) =>
              Math.min(columns.length - 1, prev + 1)
            );
            setSelectedCardIndex(0);
          }
          break;
        case "Enter":
          e.preventDefault();
          const selectedCard =
            columns[selectedColumnIndex]?.cards[selectedCardIndex];
          if (selectedCard) {
            window.location.href = selectedCard.link;
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns, selectedColumnIndex, selectedCardIndex, onDrop]);

  return (
    <div className="flex gap-8 w-full">
      {columns.map((column, columnIndex) => (
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
            {column.cards.map((card, cardIndex) => (
              <Link href={card.link} key={card.id} passHref legacyBehavior>
                <motion.div
                  layoutId={card.id}
                  draggable
                  onMouseDown={() => onDragStart(card, column.id)}
                  onDragStart={() => onDragStart(card, column.id)}
                  onDragEnd={onDragEnd}
                  onClick={() => {
                    setSelectedColumnIndex(columnIndex);
                    setSelectedCardIndex(cardIndex);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-2 bg-white border rounded shadow cursor-grab flex flex-col gap-2 xl:flex-row justify-between border-${
                    card.color
                  }-500 ${
                    selectedColumnIndex === columnIndex &&
                    selectedCardIndex === cardIndex
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span className="">{card.title}</span>
                  <div className="text-xs mt-0 xl:mt-1 text-gray-500">
                    {card.tailText}
                  </div>
                </motion.div>
              </Link>
            ))}
            <AnimatePresence mode="popLayout">
              {selectedColumnIndex === columnIndex &&
                column.cards.length === 0 &&
                arrowKeysEnabled && (
                  <motion.div
                    className="p-2 bg-gray-50 ring-2 ring-blue-500 rounded shadow-sm"
                    layoutId="selected-column"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-gray-400 text-sm">
                      Shift + ←→↑↓ to move items
                    </span>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
