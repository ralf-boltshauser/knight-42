"use server";
import { prisma } from "@/lib/client";
import { Alert, AlertStatus, AlertType, DetectionSource } from "@prisma/client";
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
  await prisma.alert.create({
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
    },
  });

  redirect(`/alerts`);
}

export async function updateAlert(alert: {
  id: string;
  name: string;
  categoryId: string;
  type: AlertType;
  assignedInvestigatorId: string | undefined;
  status: AlertStatus;
  description: string;
  endDateTime: Date | undefined;
  detectionSource: DetectionSource;
}) {
  await prisma.alert.update({
    where: { id: alert.id },
    data: {
      name: alert.name,
      categoryId: alert.categoryId,
      type: alert.type,
      assignedInvestigatorId: alert.assignedInvestigatorId,
      status: alert.status,
      description: alert.description,
      endDateTime: alert.endDateTime,
      detectionSource: alert.detectionSource,
    },
  });

  revalidatePath(`/alerts/${alert.id}`);
  revalidatePath(`/alerts`);
  revalidatePath(`/assets`);
}

export async function getIOCTypes() {
  return await prisma.iOCType.findMany();
}

export async function createIOC(
  ioc: z.infer<typeof IOCSchema>,
  alertId: string
) {
  await prisma.iOC.create({
    data: {
      ...ioc,
      linkedAlerts: { connect: { id: alertId } },
    },
  });
  revalidatePath(`/alerts/${alertId}`);
  console.log("IOC created");
}

export async function createResponseAction(
  responseAction: z.infer<typeof ResponseActionSchema>,
  alertId: string,
  affectedAssetId: string | undefined,
  assignedTeamMemberId: string | undefined
) {
  console.log(responseAction);
  await prisma.responseAction.create({
    data: {
      ...responseAction,
      relatedIncidentId: alertId,
      affectedAssetId: affectedAssetId,
      assignedTeamMemberId: assignedTeamMemberId,
    },
  });

  console.log("Response action created");

  revalidatePath(`/alerts/${alertId}`);
}

export async function updateResponseAction(
  id: string,
  responseAction: Partial<z.infer<typeof ResponseActionSchema>>
) {
  await prisma.responseAction.update({
    where: { id },
    data: {
      ...responseAction,
    },
  });
}
