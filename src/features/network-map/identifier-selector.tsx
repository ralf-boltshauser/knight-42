"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fieldAxis } from "@/types/field";
import { useState } from "react";

export default function IdentifierSelectorDialog({
  identifier,
  setIdentifier,
}: {
  identifier?: string;
  setIdentifier: (identifier: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleFieldChange = (index: number, jndex: number) => {
    if (index + jndex > 0) {
      setIdentifier(
        fieldAxis.horizontal[index - 1] + fieldAxis.vertical[jndex]
      );
      setOpen(false);
    }
  };

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
                  <div className="w-10 h-10 border border-black">
                    {index === 0 ? "" : fieldAxis.horizontal[index - 1]}
                  </div>
                  {Array.from({ length: fieldAxis.vertical.length }).map(
                    (_, jndex) => (
                      <div
                        key={jndex}
                        className={`w-10 cursor-pointer hover:bg-gray-200 h-10 border border-black ${
                          identifier ===
                          fieldAxis.horizontal[index - 1] +
                            fieldAxis.vertical[jndex]
                            ? "bg-green-200"
                            : ""
                        }`}
                        onClick={() => {
                          handleFieldChange(index, jndex);
                        }}
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
