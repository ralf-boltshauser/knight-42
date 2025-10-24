"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import { ComponentStatusDialog } from "./component-status-dialog";
import { HealthStatus } from "./service-actions";

interface ComponentNodeProps {
  data: {
    name: string;
    healthStatus: HealthStatus;
    componentId: string;
    onStatusChange?: (componentId: string, newStatus: boolean) => void;
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

export function ComponentNode({ data }: ComponentNodeProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isUp = data.healthStatus === "UP";

  const handleClick = () => {
    setDialogOpen(true);
  };

  const handleStatusChange = (newStatus: boolean) => {
    if (data.onStatusChange) {
      data.onStatusChange(data.componentId, newStatus);
    }
  };

  return (
    <>
      <div
        className={`relative z-10 rounded-lg border-2 p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow ${getHealthColor(
          data.healthStatus
        )}`}
        style={{ width: "144px" }}
        onClick={handleClick}
        title="Click to change status"
      >
        <Handle type="target" position={Position.Top} />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold">{data.name}</h3>
            <div className="flex items-center gap-1">
              {getHealthIcon(data.healthStatus)}
            </div>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} />
      </div>

      <ComponentStatusDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        componentName={data.name}
        currentStatus={isUp}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
