"use server";
import { prisma } from "@/lib/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ThreatActorSchema } from "./threat-actor-schema";

export async function getThreatActors() {
  return await prisma.threatActor.findMany({
    include: {
      techniques: true,
      linkedAttackChains: true,
    },
  });
}

export async function getThreatActor(threatActorId: string) {
  return await prisma.threatActor.findUnique({
    where: { id: threatActorId },
    include: {
      techniques: {
        include: {
          childrenTechniques: true,
        },
      },
    },
  });
}

export async function getRemainingAttackChains() {
  return await prisma.attackChain.findMany({
    where: {
      relatedThreatActor: null,
    },
  });
}

export async function createThreatActor(
  threatActor: z.infer<typeof ThreatActorSchema>
) {
  console.log(threatActor);
  const ta = await prisma.threatActor.create({
    data: {
      ...threatActor,
      techniques: {
        connect: threatActor.techniques?.map((technique) => ({
          id: technique,
        })),
      },
      linkedAttackChains: {
        connect: threatActor.linkedAttackChains?.map((chain) => ({
          id: chain,
        })),
      },
    },
  });

  redirect(`/threat-actors/${ta.id}`);
}
