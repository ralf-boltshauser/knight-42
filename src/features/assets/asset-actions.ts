"use server";
import { prisma } from "@/lib/client";
import console from "console";
import { revalidatePath } from "next/cache";
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

  return newAsset;
}

export async function deleteAsset(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.asset.delete({
    where: { id },
  });

  console.log("Deleted asset", id);

  revalidatePath("/assets");
}

export async function updateAsset(asset: z.infer<typeof AssetSchema>) {
  await prisma.asset.update({
    where: { id: asset.id },
    data: asset,
  });

  revalidatePath("/assets");
}
