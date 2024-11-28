"use client";

import { fieldAxis } from "@/types/field";
import { Network } from "@prisma/client";
import { motion } from "framer-motion";
import useFitText from "use-fit-text";
import CreateNetworkFormDialog from "./create-network-form";

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
      <motion.div
        key={network.id + "network"}
        className={`absolute bg-${network.networkColor.toLowerCase()}-500 hover:animate-pulse opacity-30 z-10 border rounded-lg border-dashed`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
      <motion.div
        key={network.id + "legend"}
        className="absolute z-20 text-black text-center flex flex-col items-center justify-center rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 2,
          boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          background: "white",
          zIndex: 100,
        }}
        style={{
          left: `${legendFieldCol * cellWidth}px`,
          top: `${legendFieldRow * cellHeight}px`,
          width: `${cellWidth}px`,
          height: `${cellHeight}px`,
        }}
      >
        <CreateNetworkFormDialog network={network}>
          <div className="w-full flex flex-col items-center justify-center">
            <span className="font-bold">{name}</span>
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
        </CreateNetworkFormDialog>
      </motion.div>
    </>
  );
}
