"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fieldAxis } from "@/types/field";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getBlockedSlots } from "./network-actions";

export default function IdentifierSelectorDialog({
  identifier,
  setIdentifier,
}: {
  identifier?: string;
  setIdentifier: (identifier: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleFieldChange = (index: number, jndex: number) => {
    if (index + jndex > 0) {
      setIdentifier(
        fieldAxis.horizontal[index - 1] + fieldAxis.vertical[jndex]
      );
      setOpen(false);
    }
  };

  const { data: blockedSlots } = useQuery({
    queryKey: ["blockedSlots"],
    queryFn: () => getBlockedSlots(),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="block" variant={"outline"}>
          {identifier}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit max-w-none">
        <div>
          <div className="flex flex-row gap-2">
            {Array.from({ length: fieldAxis.horizontal.length + 1 }).map(
              (_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div
                    className={`w-10 h-10 border border-black ${
                      hoveredCell && index === hoveredCell.x
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    {index === 0 ? "" : fieldAxis.horizontal[index - 1]}
                  </div>
                  {Array.from({ length: fieldAxis.vertical.length }).map(
                    (_, jndex) => (
                      <div
                        key={jndex}
                        className={`w-10 cursor-pointer h-10 border border-black  ${
                          hoveredCell &&
                          (index === hoveredCell.x || jndex === hoveredCell.y)
                            ? "bg-gray-200"
                            : "hover:bg-gray-200"
                        } ${
                          blockedSlots?.some(
                            (slot) => slot.x === index - 1 && slot.y === jndex
                          )
                            ? "bg-red-200"
                            : ""
                        } ${
                          identifier ===
                          fieldAxis.horizontal[index - 1] +
                            fieldAxis.vertical[jndex]
                            ? "bg-green-200"
                            : ""
                        }`}
                        onClick={() => {
                          handleFieldChange(index, jndex);
                        }}
                        onMouseEnter={() =>
                          setHoveredCell({ x: index, y: jndex })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {index === 0 ? fieldAxis.vertical[jndex] : null}
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
