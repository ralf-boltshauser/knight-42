"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PopulatedResponseAction } from "@/types/alert";
import { getActionStatusColor } from "@/types/alert-types";
import { ResponseActionStatus } from "@prisma/client";
import { format } from "date-fns";
import { useState } from "react";
import { updateResponseAction } from "../alert-actions";

export default function ResponseActionItem({
  responseActionItem,
}: {
  responseActionItem: PopulatedResponseAction;
}) {
  const [status, setStatus] = useState(responseActionItem.status);

  const handleStatusChange = async (status: ResponseActionStatus) => {
    setStatus(status);
    await updateResponseAction(responseActionItem.id, { status });
  };
  return (
    <Card key={responseActionItem.id}>
      <CardHeader>
        <CardTitle className="text-sm flex justify-between flex-row items-center gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="">{responseActionItem.name}</span>
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(value as ResponseActionStatus)
              }
            >
              <SelectTrigger className="w-fit h-fit p-0 border-0 hover:bg-transparent focus:ring-0">
                <SelectValue>
                  <Badge className={`${getActionStatusColor(status)}`}>
                    {status}
                  </Badge>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={ResponseActionStatus.PENDING}
                  className="p-0 focus:bg-transparent"
                >
                  <Badge
                    className={getActionStatusColor(
                      ResponseActionStatus.PENDING
                    )}
                  >
                    PENDING
                  </Badge>
                </SelectItem>
                <SelectItem
                  value={ResponseActionStatus.COMPLETED}
                  className="p-0 focus:bg-transparent"
                >
                  <Badge
                    className={getActionStatusColor(
                      ResponseActionStatus.COMPLETED
                    )}
                  >
                    COMPLETED
                  </Badge>
                </SelectItem>
                <SelectItem
                  value={ResponseActionStatus.CANCELLED}
                  className="p-0 focus:bg-transparent"
                >
                  <Badge
                    className={getActionStatusColor(
                      ResponseActionStatus.CANCELLED
                    )}
                  >
                    CANCELLED
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {responseActionItem.assignedTeamMember?.name}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-between">
        <Badge variant={"outline"}>
          {responseActionItem.affectedAsset?.name || "N/A"}
        </Badge>
        <p className="text-sm text-muted-foreground">
          Timestamp:{" "}
          {format(new Date(responseActionItem.createdAt), "MMM d, yyyy HH:mm")}
        </p>
      </CardContent>
    </Card>
  );
}
