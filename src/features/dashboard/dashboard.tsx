"use client";

import KanbanBoard from "@/components/ui/kanban-board";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAlertStatusColor } from "@/types/alert-types";
import { Alert, AlertStatus, Asset, ResponseAction } from "@prisma/client";
import { updateAlertStatus } from "./dashboard-actions";

export default function Dashboard({
  myAlerts,
  myAssets,
  myResponseActions,
}: {
  myAlerts: Alert[];
  myAssets: Asset[];
  myResponseActions: ResponseAction[];
}) {
  return (
    <div>
      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
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
                })),
            }))}
          />
        </TabsContent>
        <TabsContent value="assets">
          {myAssets.length > 0 ? (
            <div>
              {myAssets.map((asset) => (
                <div key={asset.id}>{asset.name}</div>
              ))}
            </div>
          ) : (
            <div>No assets found</div>
          )}
        </TabsContent>
        <TabsContent value="response-actions">
          {myResponseActions.length > 0 ? (
            <div>
              {myResponseActions.map((responseAction) => (
                <div key={responseAction.id}>{responseAction.name}</div>
              ))}
            </div>
          ) : (
            <div>No response actions found</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
