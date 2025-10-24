import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Server,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { HealthStatus } from "./service-actions";

interface Service {
  id: string;
  name: string;
  description: string | null;
  owner: string | null;
  missionCritical: boolean;
  healthStatus: HealthStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceListProps {
  services: Service[];
}

function getHealthBadge(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case "UP":
      return (
        <Badge
          variant="default"
          className="flex items-center gap-1 bg-green-500"
        >
          <CheckCircle className="h-3 w-3" />
          Up
        </Badge>
      );
    case "DEGRADED":
      return (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 bg-yellow-500 text-white"
        >
          <AlertCircle className="h-3 w-3" />
          Degraded
        </Badge>
      );
    case "DOWN":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Down
        </Badge>
      );
  }
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Server className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No services found</h3>
        <p className="text-muted-foreground">
          Create your first service to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service.id} href={`/services/${service.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getHealthBadge(service.healthStatus)}
                  {service.missionCritical && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Critical
                    </Badge>
                  )}
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{service.owner || "No owner assigned"}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
