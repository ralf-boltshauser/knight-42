"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopulatedAlert } from "@/types/alert";
import { AssetCriticality } from "@prisma/client";
import { Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AlertListItem from "./alert-list-item";

// Mock data based on the Prisma schema
export default function AlertList({ alerts }: { alerts: PopulatedAlert[] }) {
  const [alertTypeFilter, setAlertTypeFilter] = useState("ALL");
  const [alertStatusFilter, setAlertStatusFilter] = useState("ALL");

  const populatedAlerts = alerts;

  const filteredAlerts = populatedAlerts.filter(
    (alert) =>
      (alertTypeFilter === "ALL" || alert.type === alertTypeFilter) &&
      (alertStatusFilter === "ALL" || alert.status === alertStatusFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 ">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select onValueChange={(value) => setAlertTypeFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="ALERT">Alert</SelectItem>
                <SelectItem value="INCIDENT">Incident</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select onValueChange={(value) => setAlertStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="INITIAL_INVESTIGATION">
                Initial Investigation
              </SelectItem>
              <SelectItem value="ESCALATED">Escalated</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/alerts/create">
          <Button>Create Alert</Button>
        </Link>
      </div>
      <div className="grid gap-6">
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-muted-foreground">
              All clear! No alerts to review right now.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Great work keeping things under control! Why not grab a coffee and
              take a well-deserved break? ☕️
            </p>
          </div>
        )}
        {filteredAlerts
          .toSorted((a, b) => {
            return (
              b.assets.reduce(
                (acc, asset) =>
                  acc +
                  Object.values(AssetCriticality).indexOf(asset.criticality),
                0
              ) -
              a.assets.reduce(
                (acc, asset) =>
                  acc +
                  Object.values(AssetCriticality).indexOf(asset.criticality),
                0
              )
            );
          })
          .map((alert) => {
            return <AlertListItem key={alert.id} alert={alert} />;
          })}
      </div>
    </div>
  );
}
