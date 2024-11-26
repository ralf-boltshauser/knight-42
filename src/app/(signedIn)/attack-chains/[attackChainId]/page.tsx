import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAlerts,
  getAttackChain,
} from "@/features/attack-chains/attack-chain-actions";
import AttackChainAlerts from "@/features/attack-chains/attack-chain-detail/attack-chain-alerts";
import LinkThreatActor from "@/features/attack-chains/attack-chain-detail/link-threat-actor";
import RecommendedThreatActors from "@/features/attack-chains/attack-chain-detail/recommended-threat-actors";
import MittreAttackFramework from "@/features/attack-chains/mittre-attack-framework";
import { getAllTtps } from "@/features/techniques/technique-actions";
import ThreatActorDetail from "@/features/threat-actors/threat-actor-detail/threat-actor-detail";
import { prisma } from "@/lib/client";
import { PopulatedTechnique } from "@/types/technique";
import { notFound } from "next/navigation";

export default async function AttackChainDetailPage({
  params: { attackChainId },
}: {
  params: { attackChainId: string };
}) {
  const attackChain = await getAttackChain(attackChainId);

  const allTtps = await getAllTtps();

  const alerts = await getAlerts();
  if (!attackChain || !alerts) {
    notFound();
  }

  const ttps = attackChain.alerts
    .map((alert) => alert.technique)
    .filter((technique): technique is PopulatedTechnique => technique !== null);
  const threatActors = await prisma.threatActor.findMany();

  console.log("ttps", ttps);

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
          {attackChain.relatedThreatActor ? (
            <ThreatActorDetail
              allTtps={allTtps}
              threatActor={attackChain.relatedThreatActor}
            />
          ) : (
            <div className="space-y-6">
              <RecommendedThreatActors attackChain={attackChain} />
              <LinkThreatActor
                threatActors={threatActors}
                attackChainId={attackChainId}
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="framework">
          <MittreAttackFramework allTtps={allTtps} ttps={ttps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
