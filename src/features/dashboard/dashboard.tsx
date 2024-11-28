"use client";

import KanbanBoard from "@/components/ui/kanban-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getActionStatusColor,
  getAlertStatusColor,
  getReportStatusColor,
} from "@/types/alert-types";
import {
  Alert,
  AlertStatus,
  Asset,
  AssetCriticality,
  ReportStatus,
  ResponseAction,
  ResponseActionStatus,
  User,
} from "@prisma/client";
import { useQueryState } from "nuqs";

import { Badge } from "@/components/ui/badge";
import { getCriticalityColor } from "@/types/asset-types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  updateAlertStatus,
  updateReportStatus,
  updateResponseActionStatus,
} from "./dashboard-actions";

export default function Dashboard({
  myAlerts,
  myResponseActions,
}: {
  myAlerts: (Alert & { assignedInvestigator: User | null; assets: Asset[] })[];
  myResponseActions: (ResponseAction & {
    assignedTeamMember: User | null;
    affectedAsset: Asset | null;
  })[];
}) {
  const { data: session } = useSession();
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "alerts",
  });

  const activeAlerts = myAlerts.filter(
    (alert) =>
      alert.status !== AlertStatus.RESOLVED &&
      (alert.assignedInvestigator?.id === session?.user.dbId ||
        !alert.assignedInvestigator)
  );
  const activeResponseActions = myResponseActions.filter(
    (responseAction) =>
      (responseAction.status == ResponseActionStatus.PENDING ||
        responseAction.status == ResponseActionStatus.OUTSTANDING) &&
      (responseAction.assignedTeamMember?.id === session?.user.dbId ||
        !responseAction.assignedTeamMember)
  );
  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            Alerts
            {activeAlerts.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="response-actions"
            className="flex items-center gap-2"
          >
            Response Actions
            {activeResponseActions.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeResponseActions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts">
          <KanbanBoard
            onUpdate={(columnId, cardId) => {
              updateAlertStatus(cardId, columnId as AlertStatus);
            }}
            columns={Object.values(AlertStatus).map((status) => ({
              id: status,
              title: status,
              color: getAlertStatusColor(status),
              cards: myAlerts
                .filter((alert) => alert.status === status)
                .map((alert) => ({
                  id: alert.id,
                  link: `/alerts/${alert.id}`,
                  color: getCriticalityColor(
                    alert.assets.reduce((acc, asset) => {
                      return acc.criticality > asset.criticality ? acc : asset;
                    }).criticality
                  ),
                  title: alert.name,
                  tailText: (
                    <div className="flex flex-row gap-2 items-center">
                      {alert.assets.map((a) => (
                        <Link key={a.id} href={`/assets/${a.id}`}>
                          <Badge variant="outline">{a.name}</Badge>
                        </Link>
                      ))}
                      <span>{alert.assignedInvestigator?.name ?? ""}</span>
                    </div>
                  ),
                })),
            }))}
          />
        </TabsContent>
        <TabsContent value="response-actions">
          <KanbanBoard
            onUpdate={(columnId, cardId) => {
              updateResponseActionStatus(
                cardId,
                columnId as ResponseActionStatus
              );
            }}
            columns={Object.values(ResponseActionStatus).map((status) => ({
              id: status,
              title: status,
              color: getActionStatusColor(status),
              cards: myResponseActions
                .filter((responseAction) => responseAction.status === status)
                .map((responseAction) => ({
                  id: responseAction.id,
                  link: `/alerts/${responseAction.relatedIncidentId}?tab=actions`,
                  color: getCriticalityColor(
                    responseAction.affectedAsset?.criticality ??
                      AssetCriticality.LOW
                  ),
                  title: responseAction.name,
                  tailText: responseAction.assignedTeamMember?.name ?? "",
                })),
            }))}
          />
        </TabsContent>
        <TabsContent value="reports">
          <KanbanBoard
            columns={Object.values(ReportStatus).map((status) => ({
              id: status,
              title: status,
              color: getReportStatusColor(status),
              cards: myAlerts
                .filter((alert) => alert.reportStatus === status)
                .map((alert) => ({
                  id: alert.id,
                  link: `/alerts/${alert.id}?tab=timeline`,
                  color: getCriticalityColor(
                    alert.assets.reduce((acc, asset) => {
                      return acc.criticality > asset.criticality ? acc : asset;
                    }).criticality
                  ),
                  title: alert.name,
                  tailText: `${alert.assignedInvestigator?.name ?? ""} ${
                    alert.lastReportAt
                      ? `(Last reported: ${alert.lastReportAt.toLocaleTimeString(
                          "de-ch"
                        )})`
                      : ""
                  }`,
                })),
            }))}
            onUpdate={(columnId, cardId) => {
              updateReportStatus(cardId, columnId as ReportStatus);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
