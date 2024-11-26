"use client";

import { fieldAxis } from "@/types/field";
import { Network } from "@prisma/client";
import useFitText from "use-fit-text";

export default function NetworkMapNetwork({
  network,
  cellWidth,
  cellHeight,
}: {
  network: Network;
  cellWidth: number;
  cellHeight: number;
}) {
  const fromCol = fieldAxis.horizontal.indexOf(network.fieldFrom[0]) + 1;
  const { fontSize, ref } = useFitText({});
  const fromRow = parseInt(network.fieldFrom.slice(1));
  const toCol = fieldAxis.horizontal.indexOf(network.fieldTo[0]) + 1;
  const toRow = parseInt(network.fieldTo.slice(1));

  const left = fromCol * cellWidth;
  const top = fromRow * cellHeight;
  const width = (toCol - fromCol + 1) * cellWidth;
  const height = (toRow - fromRow + 1) * cellHeight;

  const name = network.name;

  const legendFieldCol =
    fieldAxis.horizontal.indexOf(network.fieldLegend[0]) + 1;
  const legendFieldRow = parseInt(network.fieldLegend.slice(1));

  return (
    <>
      <div
        key={network.id}
        className={`absolute bg-${network.networkColor.toLowerCase()}-500 opacity-30 z-10 border rounded-lg border-dashed`}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
      <div
        key={network.id}
        className="absolute z-20 text-black text-center flex flex-col items-center justify-center"
        style={{
          left: `${legendFieldCol * cellWidth}px`,
          top: `${legendFieldRow * cellHeight}px`,
          width: `${cellWidth}px`,
          height: `${cellHeight}px`,
        }}
      >
        <span className="font-bold"> {name}</span>
        <span
          ref={ref}
          style={{
            fontSize,
            width: `${cellWidth * 0.8}px`,
          }}
        >
          {network.ipRange}
        </span>
      </div>
    </>
  );
}
