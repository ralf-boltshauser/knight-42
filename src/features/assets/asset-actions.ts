"use server";
import { prisma } from "@/lib/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AssetSchema } from "./asset-schema";

export async function createAsset(asset: z.infer<typeof AssetSchema>) {
  const newAsset = await prisma.asset.create({
    data: {
      name: asset.name,
      identifier: asset.identifier,
      visibility: asset.visibility,
      type: asset.type,
      criticality: asset.criticality,
      assignedTeamMemberId: asset.assignedTeamMemberId,
    },
  });

  revalidatePath("/assets");
  redirect(`/assets/${newAsset.id}`);
}

export async function deleteAsset(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.asset.delete({
    where: { id },
  });

  revalidatePath("/assets");
}

export async function updateAsset(asset: z.infer<typeof AssetSchema>) {
  await prisma.asset.update({
    where: { id: asset.id },
    data: asset,
  });

  revalidatePath("/assets");
  revalidatePath(`/assets/${asset.id}`);
}

export async function getAssets() {
  const assetList = await prisma.asset.findMany({
    include: {
      assetUptimes: true,
      assignedTeamMember: true,
      alerts: {
        include: {
          category: true,
          assignedInvestigator: true,
        },
      },
      responseActions: {
        include: {
          assignedTeamMember: true,
        },
      },
    },
  });

  return assetList;
}
