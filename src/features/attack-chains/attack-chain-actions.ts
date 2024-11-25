"use server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import { AlertType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getAlerts() {
  return await prisma.alert.findMany({
    where: {
      type: AlertType.INCIDENT,
      attackChainId: null,
    },
    include: {
      assets: true,
    },
  });
}

export async function createAttackChain(name: string, alertIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user.dbId) {
    throw new Error("User not found");
  }

  const attackChain = await prisma.attackChain.create({
    data: {
      name,
      alerts: { connect: alertIds.map((id) => ({ id })) },
      analystId: session?.user.dbId,
    },
  });

  redirect(`/attack-chains/${attackChain.id}`);
}

export async function getAttackChain(attackChainId: string) {
  return await prisma.attackChain.findUnique({
    where: { id: attackChainId },
    include: {
      relatedThreatActor: true,
      alerts: {
        include: {
          category: true,
          assets: true,
          assignedInvestigator: true,
          responseActions: {
            include: {
              assignedTeamMember: true,
              affectedAsset: true,
            },
          },
          relatedIOCs: {
            include: {
              type: true,
            },
          },
        },
      },
      analyst: true,
    },
  });
}
