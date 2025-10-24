"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { HealthStatus } from "./service-actions";

interface ComponentStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  componentName: string;
  currentStatus: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

function getHealthIcon(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case "UP":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "DEGRADED":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "DOWN":
      return <XCircle className="h-4 w-4 text-red-500" />;
  }
}

function getHealthStatus(isUp: boolean): HealthStatus {
  return isUp ? "UP" : "DOWN";
}

export function ComponentStatusDialog({
  open,
  onOpenChange,
  componentName,
  currentStatus,
  onStatusChange,
}: ComponentStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(currentStatus);

  const handleSave = () => {
    onStatusChange(selectedStatus);
    onOpenChange(false);
  };

  const currentHealthStatus = getHealthStatus(currentStatus);
  const selectedHealthStatus = getHealthStatus(selectedStatus);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Component Status</DialogTitle>
          <DialogDescription>
            Change the operational status of <strong>{componentName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Status</label>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
              {getHealthIcon(currentHealthStatus)}
              <span className="capitalize">
                {currentHealthStatus.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select
              value={selectedStatus.toString()}
              onValueChange={(value) => setSelectedStatus(value === "true")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Up</span>
                  </div>
                </SelectItem>
                <SelectItem value="false">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Down</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStatus !== currentStatus && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                {getHealthIcon(selectedHealthStatus)}
                <span className="capitalize">
                  {selectedHealthStatus.toLowerCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedStatus === currentStatus}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
