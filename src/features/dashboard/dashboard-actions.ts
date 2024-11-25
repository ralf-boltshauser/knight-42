"use server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import { AlertStatus, AlertType, ResponseActionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateAlertStatus(alertId: string, status: AlertStatus) {
  await prisma.alert.update({
    where: { id: alertId },
    data: {
      status,
      type: status == AlertStatus.ESCALATED ? AlertType.INCIDENT : undefined,
    },
  });
  revalidatePath("/");
}

export async function updateResponseActionStatus(
  responseActionId: string,
  status: ResponseActionStatus
) {
  await prisma.responseAction.update({
    where: { id: responseActionId },
    data: { status },
  });
  revalidatePath("/");
}

export async function getDashboardNavbarCount() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      alerts: 0,
      responseActions: 0,
    };
  }
  const myActiveAlerts = await prisma.alert.count({
    where: {
      assignedInvestigatorId: session.user.dbId,
      status: {
        not: AlertStatus.RESOLVED,
      },
    },
  });
  const myActiveResponseActions = await prisma.responseAction.count({
    where: {
      assignedTeamMemberId: session.user.dbId,
      status: ResponseActionStatus.PENDING,
    },
  });
  return {
    alerts: myActiveAlerts,
    responseActions: myActiveResponseActions,
  };
}
