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
import { Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import AlertListItem from "./alert-list-item";

// Mock data based on the Prisma schema
export default function AlertList({ alerts }: { alerts: PopulatedAlert[] }) {
  const [alertTypeFilter, setAlertTypeFilter] = useState("ALL");
  const [alertStatusFilter, setAlertStatusFilter] = useState("ALL");

  const populatedAlerts = alerts;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copy(text);
    toast.success("Copied to clipboard");
  };

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
        {filteredAlerts
          .toSorted((a, b) => {
            return (
              new Date(b.startDateTime).getTime() -
              new Date(a.startDateTime).getTime()
            );
          })
          .map((alert) => {
            return <AlertListItem key={alert.id} alert={alert} />;
          })}
      </div>
    </div>
  );
}
