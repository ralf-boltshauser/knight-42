"use server";
import { prisma } from "@/lib/client";
import { AlertStatus, AlertType, ResponseActionStatus } from "@prisma/client";
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
