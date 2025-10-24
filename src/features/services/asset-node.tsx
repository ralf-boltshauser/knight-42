"use client";

import { AlertCircle, CheckCircle, XCircle, Server } from "lucide-react";
import { Handle, Position } from "reactflow";
import { HealthStatus } from "./service-actions";

interface AssetNodeProps {
  data: {
    name: string;
    identifier: string;
    type: string;
    healthStatus: HealthStatus;
    role?: string;
  };
}

function getHealthIcon(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case "UP":
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    case "DEGRADED":
      return <AlertCircle className="h-3 w-3 text-yellow-500" />;
    case "DOWN":
      return <XCircle className="h-3 w-3 text-red-500" />;
  }
}

function getHealthColor(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case "UP":
      return "border-green-500 bg-green-50";
    case "DEGRADED":
      return "border-yellow-500 bg-yellow-50";
    case "DOWN":
      return "border-red-500 bg-red-50";
  }
}

function getAssetIcon(type: string) {
  // Map asset types to appropriate icons
  switch (type.toLowerCase()) {
    case "windows_server":
    case "linux_server":
    case "server":
      return <Server className="h-3 w-3 text-blue-500" />;
    default:
      return <Server className="h-3 w-3 text-gray-500" />;
  }
}

export function AssetNode({ data }: AssetNodeProps) {
  return (
    <div
      className={`relative z-10 rounded-lg border-2 p-2 shadow-lg ${getHealthColor(
        data.healthStatus
      )}`}
      style={{ width: "120px" }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {getAssetIcon(data.type)}
            <h3 className="text-xs font-semibold truncate" title={data.name}>
              {data.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {getHealthIcon(data.healthStatus)}
          </div>
        </div>
        <div className="text-xs text-gray-500 truncate" title={data.identifier}>
          {data.identifier}
        </div>
        {data.role && (
          <div className="text-xs text-blue-600 font-medium">
            {data.role}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
