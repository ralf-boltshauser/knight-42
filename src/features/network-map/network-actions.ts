"use server";

import { prisma } from "@/lib/client";
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
