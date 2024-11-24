import { Badge } from "@/components/ui/badge";
import { AssetCriticality, AssetType, AssetVisibility } from "@prisma/client";
import {
  AlertCircle,
  CircleHelp,
  Eye,
  EyeOff,
  Server,
  User,
} from "lucide-react";
export async function AssetTypeToIcon(type: AssetType) {
  if (type === AssetType.HOST) {
    return <Server />;
  }
  if (type === AssetType.USER) {
    return <User />;
  }

  return <CircleHelp />;
}

export const getCriticalityColor = (criticality: AssetCriticality) => {
  switch (criticality) {
    case AssetCriticality.LOW:
      return "bg-green-500";
    case AssetCriticality.MEDIUM:
      return "bg-yellow-500";
    case AssetCriticality.HIGH:
      return "bg-orange-500";
    case AssetCriticality.CRITICAL:
      return "bg-red-500";
  }
};

export const getVisibilityIcon = (visibility: AssetVisibility) => {
  switch (visibility) {
    case AssetVisibility.NONE:
      return <EyeOff className="h-4 w-4" />;
    case AssetVisibility.ALERTS:
      return <AlertCircle className="h-4 w-4" />;
    case AssetVisibility.FULL:
      return <Eye className="h-4 w-4" />;
  }
};

export const getVisibilityColor = (visibility: AssetVisibility) => {
  switch (visibility) {
    case AssetVisibility.NONE:
      return "gray";
    case AssetVisibility.ALERTS:
      return "orange";
    case AssetVisibility.FULL:
      return "green";
  }
};

export const getVisibilityBadge = (visibility: AssetVisibility) => {
  return (
    <Badge
      variant={getVisibilityColor(visibility)}
      className="flex items-center gap-1"
    >
      {getVisibilityIcon(visibility)}
      {visibility}
    </Badge>
  );
};
