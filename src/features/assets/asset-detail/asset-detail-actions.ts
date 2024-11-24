"use server";
import { prisma } from "@/lib/client";

export async function getAssetById(assetId: string) {
  return await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
    include: {
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
}
