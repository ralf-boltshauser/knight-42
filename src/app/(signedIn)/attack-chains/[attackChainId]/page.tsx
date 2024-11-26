import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAlerts,
  getAttackChain,
} from "@/features/attack-chains/attack-chain-actions";
import AttackChainAlerts from "@/features/attack-chains/attack-chain-detail/attack-chain-alerts";
import MittreAttackFramework from "@/features/attack-chains/mittre-attack-framework";
import { prisma } from "@/lib/client";
import { Tactic } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function AttackChainDetailPage({
  params: { attackChainId },
}: {
  params: { attackChainId: string };
}) {
  const attackChain = await getAttackChain(attackChainId);

  const allTtps = await prisma.technique.findMany({
    where: {
      parentTechniqueId: null,
    },
    include: {
      childrenTechniques: true,
    },
  });

  const ttps = await prisma.technique.findMany({
    where: {
      tactic: Tactic.INITIAL_ACCESS,
      parentTechniqueId: null,
    },
    include: {
      childrenTechniques: true,
    },
  });

  const alerts = await getAlerts();
  if (!attackChain || !alerts) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{attackChain.name}</h1>
      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="threat-actor">Threat Actor</TabsTrigger>
          <TabsTrigger value="framework">Mittre Attack Framework</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts">
          <AttackChainAlerts attackChain={attackChain} alerts={alerts} />
        </TabsContent>
        <TabsContent value="threat-actor">
          <div>Threat Actor</div>
        </TabsContent>
        <TabsContent value="framework">
          <MittreAttackFramework allTtps={allTtps} ttps={ttps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
