"use server";

import { prisma } from "@/lib/client";
import { fieldAxis } from "@/types/field";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NetworkSchema } from "./network-schema";

export async function createNetwork(network: z.infer<typeof NetworkSchema>) {
  await prisma.network.create({
    data: network,
  });

  revalidatePath("/network-map");
}

export async function updateNetwork(network: z.infer<typeof NetworkSchema>) {
  await prisma.network.update({
    where: { id: network.id },
    data: network,
  });

  revalidatePath("/network-map");
}

export async function getNetworks() {
  return await prisma.network.findMany();
}

export async function getNetworkMapAssets() {
  return await prisma.asset.findMany();
}

export async function getNetworkMapAlerts() {
  return await prisma.alert.findMany({
    include: {
      assets: true,
    },
  });
}

export async function getNetworkMapEvents() {
  return await prisma.event.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      asset: true,
      alert: true,
      ioc: true,
      responseAction: true,
      responsible: true,
    },
  });
}

export async function getBlockedSlots(): Promise<{ x: number; y: number }[]> {
  const blockedSlots: string[] = [];
  // fetch all asset identifiers
  const assets = await prisma.asset.findMany();
  assets.forEach((asset) => {
    blockedSlots.push(asset.identifier);
  });
  const networks = await prisma.network.findMany();
  networks.forEach((network) => {
    blockedSlots.push(network.fieldLegend);
  });
  return blockedSlots.map((s) => {
    const x = fieldAxis.horizontal.indexOf(s[0]);
    const y = fieldAxis.vertical.indexOf(s.substring(1));
    return { x, y };
  });
}
