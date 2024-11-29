import AttackChainList from "@/features/attack-chains/attack-chain-list";
import { prisma } from "@/lib/client";
import { PopulatedAttackChain } from "@/types/attack-chain";

export default async function AttackChainPage() {
  const attackChains = await prisma.attackChain.findMany({
    include: {
      alerts: {
        include: {
          assets: true,
          category: true,
          assignedInvestigator: true,
          responseActions: true,
          relatedIOCs: true,
        },
      },
      analyst: true,
      relatedThreatActor: true,
    },
  });

  return (
    <AttackChainList attackChains={attackChains as PopulatedAttackChain[]} />
  );
}
