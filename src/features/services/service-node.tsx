import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Handle, Position } from "reactflow";
import { HealthStatus } from "./service-actions";

interface ServiceNodeProps {
  data: {
    name: string;
    healthStatus: HealthStatus;
    missionCritical: boolean;
  };
}

function getHealthIcon(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case "UP":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "DEGRADED":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "DOWN":
      return <XCircle className="h-4 w-4 text-red-500" />;
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

export function ServiceNode({ data }: ServiceNodeProps) {
  return (
    <div
      className={`relative z-10 rounded-lg border-2 p-4 shadow-lg ${getHealthColor(
        data.healthStatus
      )}`}
      style={{ width: "256px" }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{data.name}</h3>
          <div className="flex items-center gap-1">
            {getHealthIcon(data.healthStatus)}
            <span className="text-sm font-medium capitalize">
              {data.healthStatus.toLowerCase()}
            </span>
          </div>
        </div>
        {data.missionCritical && (
          <Badge variant="destructive" className="w-fit">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Mission Critical
          </Badge>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
