"use server";
import { prisma } from "@/lib/client";

export async function getTeamMembers() {
  const teamMembers = await prisma.user.findMany();
  return teamMembers;
}
