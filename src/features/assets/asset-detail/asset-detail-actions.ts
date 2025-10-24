"use server";
import { prisma } from "@/lib/client";

export async function getAssetById(assetId: string) {
  return await prisma.asset.findUnique({
    where: {
      id: assetId,
    },
    include: {
      assetUptimes: true,
      assignedTeamMember: true,
      sshSessions: {
        include: {
          event: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      },
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
