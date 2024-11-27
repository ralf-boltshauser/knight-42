"use server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import { convertAlertStatusToEventStatus } from "@/types/event-types";
import {
  AlertStatus,
  AlertType,
  EventAction,
  ResponseActionStatus,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateAlertStatus(alertId: string, status: AlertStatus) {
  const alert = await prisma.alert.update({
    where: { id: alertId },
    data: {
      status,
      type: status == AlertStatus.ESCALATED ? AlertType.INCIDENT : undefined,
    },
    include: {
      assets: true,
    },
  });

  if (alert.assets.length > 0) {
    for (const asset of alert.assets) {
      await prisma.event.create({
        data: {
          title: alert.name + " set to " + status,
          status: convertAlertStatusToEventStatus(status),
          assetId: asset.id,
        },
      });
    }
  }

  revalidatePath("/");
}

export async function updateResponseActionStatus(
  responseActionId: string,
  status: ResponseActionStatus
) {
  const res = await prisma.responseAction.update({
    where: { id: responseActionId },
    data: { status },
  });

  await prisma.event.create({
    data: {
      title: res.name + " set to " + status,
      action: EventAction.ACTION,
      responseActionId: responseActionId,
    },
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
