"use client";

import { AssetTypeToIcon } from "@/types/asset-types";
import { getEventStatusColor } from "@/types/event-types";
import { fieldAxis } from "@/types/field";
import { motion } from "framer-motion";
import Link from "next/link";
import useFitText from "use-fit-text";
import { getNetworkMapAssets } from "./network-actions";
import { useNetworkMap } from "./network-map-context";

export default function NetworkAsset({
  asset,
  cellWidth,
  cellHeight,
}: {
  asset: Awaited<ReturnType<typeof getNetworkMapAssets>>[number];
  cellWidth: number;
  cellHeight: number;
}) {
  const { fontSize, ref } = useFitText();

  const { getCurrentAssetStatus } = useNetworkMap();

  const assetStatus = getCurrentAssetStatus(asset.id);

  const col = fieldAxis.horizontal.indexOf(asset.identifier[0]) + 1;
  const row = parseInt(asset.identifier.slice(1));
  const left = col * cellWidth;
  const top = row * cellHeight;
  return (
    <motion.div
      className="absolute z-20 rounded flex flex-col items-center justify-evenly text-[length:var(--dynamic-text-size)] bg-transparent border-0"
      style={{ left, top, width: cellWidth, height: cellHeight }}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        // delay: (col + row) * 0.1 + 1,
        type: "spring",
        damping: 10,
        stiffness: 100,
      }}
      key={asset.id}
      onResize={(e) => {
        const el = e.target as HTMLElement;
        const size = Math.min(el.offsetWidth / 80, el.offsetHeight / 40);
        el.style.setProperty("--dynamic-text-size", `${size}px`);
      }}
      whileHover={{ scale: 2.05, zIndex: 1000 }}
    >
      <Link
        href={`/assets/${asset.id}`}
        className="flex flex-col items-center justify-evenly text-[length:var(--dynamic-text-size)] bg-transparent border-0 w-full h-full"
      >
        <div className="z-50 relative">{AssetTypeToIcon(asset.type)}</div>
        <div className="flex flex-col items-center justify-center gap-0.5 px-1 w-full relative">
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-0.5 text-black z-50"
            ref={ref}
            style={{ fontSize }}
          >
            {asset.name}
          </span>
          <span
            className="whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-0.5 text-black z-50"
            style={{ fontSize }}
          >
            {(asset.metadata as { IP: string })?.IP}
          </span>
        </div>
        <div
          className={`w-[90%] h-[90%] absolute z-10 rounded bg-${getEventStatusColor(
            assetStatus
          )}-200`}
        />
      </Link>
    </motion.div>
  );
}
