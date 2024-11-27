"use client";

import { AssetUptime } from "@prisma/client";

export default function AssetUptimeDisplay({
  assetUptimes,
  limit,
}: {
  assetUptimes: AssetUptime[];
  limit?: number;
}) {
  // asset uptime is a list of {up: boolean,} show me this as a sexy uptime display
  return (
    <div className="flex gap-1">
      {assetUptimes.slice(limit ? -limit : undefined).map((uptime, index) => (
        <div
          key={index}
          className={`w-2 h-8 rounded-full ${
            uptime.up ? "bg-green-500" : "bg-red-500"
          }`}
        />
      ))}
    </div>
  );
}
