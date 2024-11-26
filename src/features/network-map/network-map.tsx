"use client";

import { fieldAxis } from "@/types/field";
import { Network } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { getNetworkMapAssets } from "./network-actions";
import NetworkAsset from "./network-asset";
import NetworkMapNetwork from "./network-map-network";

export default function NetworkMap({
  networks,
  assets,
}: {
  networks: Network[];
  assets: Awaited<ReturnType<typeof getNetworkMapAssets>>;
}) {
  const cellRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(0);
  const [cellHeight, setCellHeight] = useState(0);

  useEffect(() => {
    const updateCellSize = () => {
      if (cellRef.current) {
        setCellWidth(cellRef.current.clientWidth + 1); // Add 2px for border width
        setCellHeight(cellRef.current.clientHeight + 1); // Add 2px for border width
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
    <div>
      <div className="flex flex-row">
        <div className="flex-grow h-screen relative max-w-[95dvw]">
          <div className="flex flex-row h-full -z-10 justify-start">
            {Array.from({ length: fieldAxis.horizontal.length + 1 }).map(
              (_, index) => {
                const cellSize = `calc(min(100dvh / ${
                  fieldAxis.vertical.length + 1
                }, (100dvw) / ${fieldAxis.horizontal.length + 1}))`;
                return (
                  <div
                    className="flex flex-col flex-1"
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
                          ref={index === 0 && jndex === 0 ? cellRef : undefined}
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
          {networks.map((network) => (
            <NetworkMapNetwork
              key={network.id}
              network={network}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
            />
          ))}
          {assets.map((asset) => (
            <NetworkAsset
              key={asset.id}
              asset={asset}
              cellWidth={cellWidth}
              cellHeight={cellHeight}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
