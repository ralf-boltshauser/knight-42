import { EventAction, EventStatus } from "@prisma/client";
import { Brain, Shield } from "lucide-react";

export const getEventStatusColor = (status: EventStatus | null) => {
  switch (status) {
    case EventStatus.OKAY:
      return "gray";
    case EventStatus.WARNING:
      return "orange";
    case EventStatus.DOWN:
      return "red";
    default:
      return "gray";
  }
};

export const getEventActionIcon = (action: EventAction) => {
  switch (action) {
    case EventAction.KNOWLEDGE:
      return Brain;
    case EventAction.ACTION:
      return Shield;
  }
};
