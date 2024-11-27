"use client";

import { fieldAxis } from "@/types/field";
import { Network } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getNetworkMapAssets, getNetworkMapEvents } from "./network-actions";
import NetworkAsset from "./network-asset";
import { NetworkMapProvider } from "./network-map-context";
import NetworkMapNetwork from "./network-map-network";
import NetworkMapTimeline from "./network-map-timeline";
import NetworkTimelineProgressIndicator from "./network-timeline-progress-indicator";

export default function NetworkMap({
  networks,
  assets,
}: {
  networks: Network[];
  assets: Awaited<ReturnType<typeof getNetworkMapAssets>>;
}) {
  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => getNetworkMapEvents(),
  });

  const cellRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  useEffect(() => {
    const updateCellSize = () => {
      if (cellRef.current) {
        const computedStyle = window.getComputedStyle(cellRef.current);
        const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth);
        const borderRightWidth = parseFloat(computedStyle.borderRightWidth);
        const borderTopWidth = parseFloat(computedStyle.borderTopWidth);
        const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth);

        setCellWidth(
          cellRef.current.clientWidth + borderLeftWidth + borderRightWidth
        );
        setCellHeight(
          cellRef.current.clientHeight + borderTopWidth + borderBottomWidth
        );
      }
    };

    const resizeObserver = new ResizeObserver(updateCellSize);
    if (cellRef.current) {
      resizeObserver.observe(cellRef.current);
    }

    window.addEventListener("resize", updateCellSize);
    updateCellSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCellSize);
    };
  }, [cellRef]);
  console.log(cellWidth, cellHeight);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NetworkMapProvider events={events ?? []}>
        <div className="flex flex-row justify-center mb-3 mx-auto ">
          <div className="flex-grow relative w-fit">
            <div className="flex flex-row h-fit -z-10 justify-start">
              {Array.from({ length: fieldAxis.horizontal.length + 1 }).map(
                (_, index) => {
                  const cellSize = `calc(min(90dvh / ${
                    fieldAxis.vertical.length + 1
                  }, (100dvw - 500px) / ${fieldAxis.horizontal.length + 1}))`;
                  return (
                    <div
                      className="flex flex-col"
                      style={{ width: cellSize }}
                      key={`${index}-horizontal`}
                    >
                      <div
                        style={{ width: cellSize, height: cellSize }}
                        className="border border-black border-dashed text-center flex items-center justify-center text-2xl font-bold"
                      >
                        {index === 0 ? "" : fieldAxis.horizontal[index - 1]}
                      </div>
                      {Array.from({ length: fieldAxis.vertical.length }).map(
                        (_, jndex) => (
                          <div
                            key={`${index}-${jndex}`}
                            style={{ width: cellSize, height: cellSize }}
                            ref={
                              index === 0 && jndex === 0 ? cellRef : undefined
                            }
                            className={`cursor-pointer hover:bg-gray-200 border border-black border-dashed text-center flex items-center justify-center text-2xl font-bold`}
                          >
                            {index === 0 ? fieldAxis.vertical[jndex] : null}
                          </div>
                        )
                      )}
                    </div>
                  );
                }
              )}
            </div>
            <div>
              {networks.map((network) => (
                <NetworkMapNetwork
                  key={network.id}
                  network={network}
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                />
              ))}
            </div>
            <div>
              {assets.map((asset) => (
                <NetworkAsset
                  key={asset.id}
                  asset={asset}
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                />
              ))}
            </div>
            <NetworkTimelineProgressIndicator />
          </div>
          <NetworkMapTimeline />
        </div>
      </NetworkMapProvider>
    </motion.div>
  );
}
