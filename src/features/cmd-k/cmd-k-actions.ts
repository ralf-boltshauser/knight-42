"use server";
import { prisma } from "@/lib/client";

export async function getAlerts() {
  return await prisma.alert.findMany();
}

export async function getAssets() {
  return await prisma.asset.findMany();
}

export async function getResponseActions() {
  return await prisma.responseAction.findMany();
}

export async function getThreatActors() {
  return await prisma.threatActor.findMany();
}

export async function getAttackChains() {
  return await prisma.attackChain.findMany();
}
