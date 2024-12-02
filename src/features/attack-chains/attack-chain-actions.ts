"use server";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import { AlertType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
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
      relatedThreatActor: {
        include: {
          techniques: {
            include: {
              childrenTechniques: true,
            },
          },
          iocs: {
            include: {
              linkedAlerts: true,
            },
          },
        },
      },
      alerts: {
        include: {
          technique: {
            include: {
              childrenTechniques: true,
            },
          },
          category: true,
          assets: true,
          assignedInvestigator: true,
          responseActions: {
            include: {
              assignedTeamMember: true,
              affectedAsset: true,
            },
          },
          relatedIOCs: true,
          events: true,
        },
      },
      analyst: true,
    },
  });
}

export async function addAlertToAttackChain(formData: FormData) {
  const alertId = formData.get("alertId") as string;
  const attackChainId = formData.get("attackChainId") as string;
  if (!alertId || !attackChainId) return;

  await prisma.attackChain.update({
    where: { id: attackChainId },
    data: {
      alerts: {
        connect: { id: alertId },
      },
    },
  });
  revalidatePath(`/attack-chains/${attackChainId}`);
}

export async function linkThreatActorToAttackChain(
  attackChainId: string,
  threatActorId: string
) {
  await prisma.attackChain.update({
    where: { id: attackChainId },
    data: { relatedThreatActorId: threatActorId },
  });
  revalidatePath(`/attack-chains/${attackChainId}`);
}
