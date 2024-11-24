"use server";
import { prisma } from "@/lib/client";
import { AlertStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateAlertStatus(alertId: string, status: AlertStatus) {
  await prisma.alert.update({
    where: { id: alertId },
    data: { status },
  });
  revalidatePath("/");
}
