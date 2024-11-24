"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopulatedAsset } from "@/types/asset";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssetForm } from "../asset-form";

// Mock data based on the Prisma schema
type AssetDetailType = {
  id: string;
  name: string;
  identifier: string;
  type: string;
  criticality: string;
  visibility: "NONE" | "ALERTS" | "FULL";
  assignedTeamMember: {
    name: string;
    email: string;
  };
  notes: string;
};

type TimelineEventType = "ALERT" | "ACTION";

type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  category?: string;
  actionType?: string;
  description?: string;
  assignedTo?: {
    name: string;
  };
  name: string;
  datetime: string;
  status: string;
};

export default function AssetDetail({ asset }: { asset: PopulatedAsset }) {
  const [activeTab, setActiveTab] = useState("timeline");

  const assetDetail: AssetDetailType = {
    id: asset.id,
    name: asset.name,
    identifier: asset.identifier,
    type: asset.type,
    criticality: asset.criticality,
    visibility: asset.visibility,
    assignedTeamMember: {
      name: asset.assignedTeamMember?.name ?? "Unknown",
      email: asset.assignedTeamMember?.email ?? "Unknown",
    },
    notes: asset.notes ?? "",
  };

  // build timeline events based on alerts and response actions
  const timelineEvents: TimelineEvent[] = [
    ...asset.alerts.map((alert) => ({
      id: alert.id,
      type: "ALERT" as TimelineEventType,
      name: alert.name,
      datetime: alert.createdAt.toISOString(),
      status: alert.status,
      category: alert.category.name,
      description: alert.description,
      assignedTo: {
        name: alert.assignedInvestigator.name ?? "Unknown",
      },
    })),
    ...asset.responseActions.map((action) => ({
      id: action.id,
      type: "ACTION" as TimelineEventType,
      name: action.name,
      datetime: action.createdAt.toISOString(),
      status: action.status,
      actionType: action.actionType,
      description: action.description,
      assignedTo: {
        name: action.assignedTeamMember.name ?? "Unknown",
      },
    })),
  ].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "RESOLVED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "INITIAL_INVESTIGATION":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "LOW":
        return "bg-green-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "HIGH":
        return "bg-orange-500";
      case "CRITICAL":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">
            {assetDetail.name}
          </CardTitle>
          <CardDescription>{assetDetail.identifier}</CardDescription>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className={`${getCriticalityColor(
              assetDetail.criticality
            )} text-white`}
          >
            {assetDetail.criticality}
          </Badge>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>
                {assetDetail.assignedTeamMember.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">
                {assetDetail.assignedTeamMember.name}
              </p>
              <p className="text-muted-foreground">Owner</p>
            </div>
          </div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-6">
          {timelineEvents.length === 0 && <p className="">No events found</p>}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800"></div>
            <div className="space-y-8">
              {timelineEvents
                .toSorted(
                  (a, b) =>
                    new Date(b.datetime).getTime() -
                    new Date(a.datetime).getTime()
                )
                .map((event) => (
                  <Link
                    href={event.type === "ALERT" ? `/alerts/${event.id}` : ""}
                    key={event.id}
                    className="relative pl-8 block"
                  >
                    <div className="absolute left-0 w-8 h-8 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {event.type === "ALERT" ? (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-500" />
                            )}
                            <CardTitle className="text-lg font-semibold">
                              {event.name}
                            </CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(event.status)}
                            <span className="text-sm text-muted-foreground">
                              {format(
                                new Date(event.datetime),
                                "MMM d, yyyy HH:mm"
                              )}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="text-gray-600 my-3 prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: event.description ?? "",
                          }}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {event.type === "ALERT"
                                ? event.category
                                : event.actionType}
                            </Badge>
                            <Badge variant="outline">{event.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {event.assignedTo?.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {event.assignedTo?.name}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <AssetForm
            defaultValues={{
              ...asset,
              notes: assetDetail.notes ?? "",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
