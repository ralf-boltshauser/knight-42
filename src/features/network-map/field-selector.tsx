"use client";

import { fieldAxis, FieldType } from "@/types/field";
import { NetworkColor } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export default function FieldSelector({
  fieldFrom,
  fieldTo,
  fieldLegend,
  color,
  onFieldFromChange,
  onFieldToChange,
  onFieldLegendChange,
}: {
  fieldFrom: string;
  fieldTo: string;
  fieldLegend: string;
  onFieldFromChange: (fieldFrom: string) => void;
  onFieldToChange: (fieldTo: string) => void;
  onFieldLegendChange: (fieldLegend: string) => void;
  color: NetworkColor;
}) {
  const [currentlySelecting, setCurrentlySelecting] = useState<FieldType>(
    FieldType.FIELD_FROM
  );

  const handleFieldChange = (index: number, jndex: number) => {
    if (index + jndex > 0) {
      if (currentlySelecting === FieldType.FIELD_FROM) {
        onFieldFromChange(
          fieldAxis.horizontal[index - 1] + fieldAxis.vertical[jndex]
        );
        onFieldToChange("");
        onFieldLegendChange("");
        setCurrentlySelecting(FieldType.FIELD_TO);
      } else if (currentlySelecting === FieldType.FIELD_TO) {
        // field to needs to be bottom right of field from
        if (
          fieldAxis.horizontal.indexOf(fieldFrom[0]) <= index - 1 &&
          parseInt(fieldFrom.slice(1)) <= parseInt(fieldAxis.vertical[jndex])
        ) {
          onFieldToChange(
            fieldAxis.horizontal[index - 1] + fieldAxis.vertical[jndex]
          );
          setCurrentlySelecting(FieldType.FIELD_LEGEND);
        } else {
          toast.error("Field to needs to be bottom right of field from");
        }
      } else if (currentlySelecting === FieldType.FIELD_LEGEND) {
        // the field legend needs to be inside of the field from and to
        if (
          fieldAxis.horizontal.indexOf(fieldFrom[0]) <= index - 1 &&
          index - 1 <= fieldAxis.horizontal.indexOf(fieldTo[0]) &&
          parseInt(fieldFrom.slice(1)) <= parseInt(fieldAxis.vertical[jndex]) &&
          parseInt(fieldAxis.vertical[jndex]) <= parseInt(fieldTo.slice(1))
        ) {
          onFieldLegendChange(
            fieldAxis.horizontal[index - 1] + fieldAxis.vertical[jndex]
          );
          setCurrentlySelecting(FieldType.FIELD_FROM);
        } else {
          toast.error("Legend needs to be inside of the field from and to");
        }
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2">
        {Array.from({ length: fieldAxis.horizontal.length + 1 }).map(
          (_, index) => (
            <div className="flex flex-col gap-2">
              <div key={index} className="w-10 h-10 border border-black">
                {index === 0 ? "" : fieldAxis.horizontal[index - 1]}
              </div>
              {Array.from({ length: fieldAxis.vertical.length }).map(
                (_, jndex) => (
                  <div
                    key={jndex}
                    className={`w-10 cursor-pointer hover:bg-gray-200 h-10 border border-black ${
                      fieldFrom ===
                      fieldAxis.horizontal[index - 1] +
                        fieldAxis.vertical[jndex]
                        ? "bg-green-200"
                        : fieldTo ===
                          fieldAxis.horizontal[index - 1] +
                            fieldAxis.vertical[jndex]
                        ? "bg-blue-200"
                        : fieldLegend ===
                          fieldAxis.horizontal[index - 1] +
                            fieldAxis.vertical[jndex]
                        ? "bg-red-200"
                        : fieldFrom &&
                          fieldTo &&
                          fieldAxis.horizontal.indexOf(fieldFrom[0]) <=
                            index - 1 &&
                          index - 1 <=
                            fieldAxis.horizontal.indexOf(fieldTo[0]) &&
                          parseInt(fieldFrom.slice(1)) <=
                            parseInt(fieldAxis.vertical[jndex]) &&
                          parseInt(fieldAxis.vertical[jndex]) <=
                            parseInt(fieldTo.slice(1))
                        ? `bg-${color.toLowerCase()}-200`
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
  );
}
