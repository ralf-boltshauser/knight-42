"use client";

import KanbanBoard from "@/components/ui/kanban-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getActionStatusColor, getAlertStatusColor } from "@/types/alert-types";
import {
  Alert,
  AlertStatus,
  ResponseAction,
  ResponseActionStatus,
  User,
} from "@prisma/client";
import { useQueryState } from "nuqs";

import { useSession } from "next-auth/react";
import {
  updateAlertStatus,
  updateResponseActionStatus,
} from "./dashboard-actions";

export default function Dashboard({
  myAlerts,
  myResponseActions,
}: {
  myAlerts: (Alert & { assignedInvestigator: User | null })[];
  myResponseActions: (ResponseAction & { assignedTeamMember: User | null })[];
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
                  title: alert.name,
                  tailText: alert.assignedInvestigator?.name ?? "",
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
                  title: responseAction.name,
                  tailText: responseAction.assignedTeamMember?.name ?? "",
                })),
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
