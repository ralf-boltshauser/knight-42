"use client";

import { AssetTypeToIcon } from "@/types/asset-types";
import { fieldAxis } from "@/types/field";
import Link from "next/link";
import useFitText from "use-fit-text";
import { getNetworkMapAssets } from "./network-actions";

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

  const col = fieldAxis.horizontal.indexOf(asset.identifier[0]) + 1;
  const row = parseInt(asset.identifier.slice(1));
  const left = col * cellWidth;
  const top = row * cellHeight;
  return (
    <Link
      href={`/assets/${asset.id}`}
      key={asset.id}
      style={{ left, top, width: cellWidth, height: cellHeight }}
      className="absolute  z-20 border rounded border-dashed flex flex-col items-center justify-evenly text-[length:var(--dynamic-text-size)]"
      onResize={(e) => {
        const el = e.target as HTMLElement;
        const size = Math.min(el.offsetWidth / 80, el.offsetHeight / 40);
        el.style.setProperty("--dynamic-text-size", `${size}px`);
      }}
    >
      <div className="z-50">{AssetTypeToIcon(asset.type)}</div>
      <div className="flex flex-col items-center justify-center gap-0.5 px-1 w-full">
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
      <div className="bg-white w-[90%] h-[90%] absolute z-10 rounded"></div>
    </Link>
  );
}
