"use server";
import { prisma } from "@/lib/client";
import { getAttributeTypeFromIOCType } from "@/types/ioc-types";
import { Alert, AlertStatus, AlertType, IOC } from "@prisma/client";
import { revalidatePath } from "next/cache";

const mispApiKey = process.env.MISP_API_KEY;
const mispApiUrl = process.env.MISP_API_URL;

export async function createMispEvent(alert: Alert) {
  if (!alert.id) return;
  if (alert.status != AlertStatus.ESCALATED) {
    throw new Error("Alert is not escalated");
  }
  if (!mispApiKey || !mispApiUrl) {
    throw new Error("MISP API key or URL is not set");
  }

  if (alert.mispEntryLink) {
    throw new Error("MISP entry already exists");
  }

  if (alert.type != AlertType.INCIDENT) {
    throw new Error("Alert is not an incident");
  }

  const response = await fetch(`${mispApiUrl}/events/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${mispApiKey}`,
    },
    body: JSON.stringify({
      info: alert.name,
    }),
  });

  const res = await response.json();

  const eventId = res.Event.id;

  if (!eventId) {
    throw new Error("Failed to create MISP event");
  }

  await prisma.alert.update({
    where: { id: alert.id },
    data: {
      mispEntryLink: `${mispApiUrl}/events/view/${eventId}`,
      mispEventId: eventId,
    },
  });

  const dbAlert = await prisma.alert.findUnique({
    where: { id: alert.id },
    include: {
      relatedIOCs: true,
    },
  });

  if (!dbAlert) {
    throw new Error("Alert not found");
  }

  if (dbAlert.relatedIOCs.length > 0) {
    for (const ioc of dbAlert.relatedIOCs) {
      await createMispEventIOC(alert.id, eventId, ioc);
    }
  }

  revalidatePath(`/alerts/${alert.id}`);

  return res;
}

export async function createMispEventIOC(
  alertId: string,
  eventId: string,
  ioc: IOC
) {
  console.log(
    "createMispEventIOC",
    eventId,
    ioc,
    getAttributeTypeFromIOCType(ioc.type)
  );

  const res = await fetch(`${mispApiUrl}/attributes/add/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${mispApiKey}`,
    },
    body: JSON.stringify({
      event_id: eventId,
      value: ioc.value,
      type: getAttributeTypeFromIOCType(ioc.type),
      comment: ioc.notes,
    }),
  });

  await prisma.iOC.update({
    where: { id: ioc.id },
    data: { linkedToMisp: true },
  });

  revalidatePath(`/alerts/${alertId}`);

  const data = await res.json();
  console.log("createMispEventIOC", data);
}
