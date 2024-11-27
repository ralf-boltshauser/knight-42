"use server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import {
  convertAlertStatusToEventStatus,
  convertAlertTypeToEventStatus,
} from "@/types/event-types";
import {
  Alert,
  AlertStatus,
  AlertType,
  DetectionSource,
  EventAction,
  EventStatus,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { IOCSchema } from "./alert-detail/ioc-schema";
import { ResponseActionSchema } from "./alert-detail/response-action-schema";
import { AlertSchema } from "./alert-schema";

export async function getAssets() {
  return await prisma.asset.findMany();
}

export async function getOutstandingAssets(alert: Alert) {
  return await prisma.asset.findMany({
    where: {
      alerts: {
        none: {
          id: alert.id,
        },
      },
    },
  });
}

export async function addAssetsToAlert(alertId: string, assetIds: string[]) {
  await prisma.alert.update({
    where: { id: alertId },
    data: { assets: { connect: assetIds.map((id) => ({ id })) } },
  });

  revalidatePath(`/alerts`);
}

export async function getAlertCategories() {
  return await prisma.alertCategory.findMany();
}

export async function createAlert(alert: z.infer<typeof AlertSchema>) {
  const newAlert = await prisma.alert.create({
    data: {
      name: alert.name,
      description: alert.description,
      type: alert.type,
      startDateTime: alert.startDateTime,
      endDateTime: alert.endDateTime,
      detectionSource: alert.detectionSource,
      status: alert.status,
      categoryId: alert.categoryId,
      assets: { connect: alert.assets?.map((asset) => ({ id: asset })) },
      relatedIOCs: {
        connect: alert.relatedIOCs?.map((ioc) => ({ id: ioc })),
      },
      assignedInvestigatorId: alert.assignedInvestigatorId,
      events: {
        create: {
          title: alert.name + " created",
          asset: { connect: { id: alert.assets?.[0] } },
          action: EventAction.INVESTIGATION,
          status: EventStatus.WARNING,
          responsible: {
            connect: {
              id: alert.assignedInvestigatorId ?? undefined,
            },
          },
        },
      },
    },
  });

  redirect(`/alerts/${newAlert.id}`);
}

export async function updateAlert(alert: {
  id: string;
  name?: string;
  categoryId?: string;
  type?: AlertType;
  assignedInvestigatorId?: string;
  status?: AlertStatus;
  techniqueId?: string;
  description?: string;
  endDateTime?: Date;
  detectionSource?: DetectionSource;
}) {
  const dbAlert = await prisma.alert.update({
    where: { id: alert.id },
    data: {
      name: alert.name,
      categoryId: alert.categoryId,
      type: alert.type,
      assignedInvestigatorId: alert.assignedInvestigatorId,
      status: alert.status,
      techniqueId: alert.techniqueId,
      description: alert.description,
      endDateTime: alert.endDateTime,
      detectionSource: alert.detectionSource,
    },
  });

  console.log("alert updated", alert);

  if (alert.status) {
    await prisma.event.create({
      data: {
        title:
          alert.name +
          " " +
          (alert.status == AlertStatus.ESCALATED
            ? "escalated"
            : alert.status == AlertStatus.RESOLVED
            ? "resolved"
            : "under investigation"),
        status: convertAlertStatusToEventStatus(alert.status),
        alertId: alert.id,
        responsibleId: dbAlert.assignedInvestigatorId ?? undefined,
      },
    });
  }

  if (alert.type) {
    await prisma.event.create({
      data: {
        title:
          alert.name + " " + (alert.type == AlertType.INCIDENT && "escalated"),
        status: convertAlertTypeToEventStatus(alert.type),
        alertId: alert.id,
        responsibleId: dbAlert.assignedInvestigatorId ?? undefined,
      },
    });
  }

  if (alert.techniqueId) {
    await prisma.event.create({
      data: {
        title: alert.name + " linked to technique",
        action: EventAction.KNOWLEDGE,
        alertId: alert.id,
        responsibleId: dbAlert.assignedInvestigatorId,
      },
    });
  }

  revalidatePath(`/alerts/${alert.id}`);
  revalidatePath(`/alerts`);
  revalidatePath(`/assets`);
}

export async function getIOCTypes() {
  return await prisma.iOCType.findMany();
}

export async function createIOC(
  ioc: z.infer<typeof IOCSchema>,
  alertId: string | undefined
) {
  const session = await getServerSession(authOptions);
  const newIOC = await prisma.iOC.create({
    data: {
      ...ioc,
      linkedAlerts: { connect: { id: alertId } },
    },
  });

  if (alertId) {
    await prisma.event.create({
      data: {
        title: "IOC Identified",
        action: EventAction.KNOWLEDGE,
        alertId: alertId,
        responsibleId: session?.user.dbId,
      },
    });
  }

  revalidatePath(`/alerts/${alertId}`);
}

export async function linkIOCToAlert(iocId: string, alertId: string) {
  const session = await getServerSession(authOptions);
  await prisma.iOC.update({
    where: { id: iocId },
    data: { linkedAlerts: { connect: { id: alertId } } },
  });

  await prisma.event.create({
    data: {
      title: "IOC Identified",
      action: EventAction.KNOWLEDGE,
      alertId: alertId,
      responsibleId: session?.user.dbId,
    },
  });

  revalidatePath(`/alerts/${alertId}`);
}

export async function createResponseAction(
  responseAction: z.infer<typeof ResponseActionSchema>,
  alertId: string,
  affectedAssetId: string | undefined,
  assignedTeamMemberId: string | undefined
) {
  const res = await prisma.responseAction.create({
    data: {
      ...responseAction,
      relatedIncidentId: alertId,
      affectedAssetId: affectedAssetId,
      assignedTeamMemberId: assignedTeamMemberId,
    },
  });

  await prisma.event.create({
    data: {
      title: responseAction.name + " created",
      action: EventAction.ACTION,
      alertId: alertId,
      responsibleId: res.assignedTeamMemberId,
    },
  });

  revalidatePath(`/alerts/${alertId}`);
}

export async function updateResponseAction(
  id: string,
  responseAction: Partial<z.infer<typeof ResponseActionSchema>>
) {
  const res = await prisma.responseAction.update({
    where: { id },
    data: {
      ...responseAction,
    },
  });

  if (res.name && responseAction.status) {
    await prisma.event.create({
      data: {
        title: res.name + " set to " + responseAction.status,
        action: EventAction.ACTION,
        responseActionId: id,
        alertId: res.relatedIncidentId,
        responsibleId: res.assignedTeamMemberId,
      },
    });
  }

  revalidatePath(`/alerts/${res.relatedIncidentId}`);
}

export async function getTechniques() {
  return await prisma.technique.findMany();
}

export async function getIOCs() {
  return await prisma.iOC.findMany();
}
