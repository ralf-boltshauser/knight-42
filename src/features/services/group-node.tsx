import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Handle, Position } from "reactflow";
import { HealthStatus } from "./service-actions";

interface GroupNodeProps {
  data: {
    name: string;
    operator: "AND" | "OR";
    healthStatus: HealthStatus;
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

export function GroupNode({ data }: GroupNodeProps) {
  return (
    <div
      className={`relative z-10 rounded-lg border-2 p-2 shadow-lg ${getHealthColor(
        data.healthStatus
      )}`}
      style={{ width: "192px" }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{data.name}</h3>
          <div className="flex items-center gap-1">
            {getHealthIcon(data.healthStatus)}
          </div>
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          {data.operator}
        </Badge>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
