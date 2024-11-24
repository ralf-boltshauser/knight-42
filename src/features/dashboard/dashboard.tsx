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
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "alerts",
  });
  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="response-actions">Response Actions</TabsTrigger>
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
                  link: `/response-actions/${responseAction.id}`,
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
