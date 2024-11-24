import { AlertStatus, ResponseActionStatus } from "@prisma/client";
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "INITIAL_INVESTIGATION":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "ESCALATED":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
  }
};

export const getAlertTypeColor = (type: string) => {
  switch (type) {
    case "ALERT":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "INCIDENT":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
};

export const getActionStatusColor = (status: ResponseActionStatus) => {
  switch (status) {
    case ResponseActionStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case ResponseActionStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case ResponseActionStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export const getAlertStatusColor = (status: AlertStatus) => {
  switch (status) {
    case AlertStatus.INITIAL_INVESTIGATION:
      return "orange";
    case AlertStatus.ESCALATED:
      return "red";
    case AlertStatus.RESOLVED:
      return "green";
    default:
      return "gray";
  }
};
