import { Badge } from "@/components/ui/badge";
import { AssetCriticality, AssetType, AssetVisibility } from "@prisma/client";
import {
  Box,
  Computer,
  Eye,
  EyeOff,
  Globe,
  Router,
  Server,
  Shield,
} from "lucide-react";
export function AssetTypeToIcon(type: AssetType) {
  switch (type) {
    case AssetType.WINDOWS_WORKSTATION:
    case AssetType.LINUX_WORKSTATION:
      return <Computer />;
    case AssetType.WINDOWS_SERVER:
    case AssetType.LINUX_SERVER:
    case AssetType.SERVER:
      return <Server />;
    case AssetType.ROUTER:
      return <Router />;
    case AssetType.FIREWALL:
      return <Shield />;
    case AssetType.CONTAINER:
      return <Box />;
    case AssetType.DNS:
      return <Globe />;
  }
}

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

export const getCriticalityColor = (criticality: AssetCriticality) => {
  switch (criticality) {
    case AssetCriticality.LOW:
      return "green";
    case AssetCriticality.MEDIUM:
      return "yellow";
    case AssetCriticality.HIGH:
      return "orange";
    case AssetCriticality.CRITICAL:
      return "red";
  }
};

export const getVisibilityIcon = (visibility: AssetVisibility) => {
  switch (visibility) {
    case AssetVisibility.NONE:
      return <EyeOff className="h-4 w-4" />;
    case AssetVisibility.ALERTS:
      return <Eye className="h-4 w-4" />;
    case AssetVisibility.FULL:
      return <Eye className="h-4 w-4" />;
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
