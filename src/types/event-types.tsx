import {
  AlertStatus,
  AlertType,
  EventAction,
  EventStatus,
} from "@prisma/client";
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

export const convertAlertStatusToEventStatus = (status: AlertStatus) => {
  switch (status) {
    case AlertStatus.INITIAL_INVESTIGATION:
      return EventStatus.WARNING;
    case AlertStatus.ESCALATED:
      return EventStatus.DOWN;
    case AlertStatus.RESOLVED:
      return EventStatus.OKAY;
    default:
      return EventStatus.OKAY;
  }
};

export const convertAlertTypeToEventStatus = (type: AlertType) => {
  switch (type) {
    case AlertType.ALERT:
      return EventStatus.WARNING;
    case AlertType.INCIDENT:
      return EventStatus.DOWN;
    default:
      return EventStatus.OKAY;
  }
};
