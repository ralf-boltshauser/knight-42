import { Badge } from "@/components/ui/badge";
import { AssetCriticality, AssetType, AssetVisibility } from "@prisma/client";
import { Eye, EyeOff } from "lucide-react";
export function AssetTypeToIcon(type: AssetType) {
  function image(src: string, alt: string) {
    return (
      <img src={src} alt={alt} className="w-8 h-8" width={64} height={64} />
    );
  }
  switch (type) {
    case AssetType.WINDOWS_WORKSTATION:
      return image("/icons/windows-workstation.png", "Windows");
    case AssetType.LINUX_WORKSTATION:
      return image("/icons/linux-workstation.png", "Linux");
    case AssetType.WINDOWS_SERVER:
      return image("/icons/windows-server.png", "Windows Server");
    case AssetType.LINUX_SERVER:
      return image("/icons/linux-server.png", "Linux Server");
    case AssetType.SERVER:
      return image("/icons/server.png", "Server");
    case AssetType.ROUTER:
      return image("/icons/router.png", "Router");
    case AssetType.FIREWALL:
      return image("/icons/firewall.png", "Firewall");
    case AssetType.CONTAINER:
      return image("/icons/container.png", "Container");
    case AssetType.DNS:
      return image("/icons/dns.png", "DNS");
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
