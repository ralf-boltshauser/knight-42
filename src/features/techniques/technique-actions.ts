"use server";
import { prisma } from "@/lib/client";

export async function getAllTtps() {
  return await prisma.technique.findMany({
    where: {
      parentTechniqueId: null,
    },
    include: {
      childrenTechniques: true,
    },
  });
}
