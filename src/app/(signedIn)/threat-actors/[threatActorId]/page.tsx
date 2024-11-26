import { getAllTtps } from "@/features/techniques/technique-actions";
import { getThreatActor } from "@/features/threat-actors/threat-actor-actions";
import ThreatActorDetail from "@/features/threat-actors/threat-actor-detail/threat-actor-detail";

export default async function ThreatActorDetailPage({
  params: { threatActorId },
}: {
  params: { threatActorId: string };
}) {
  const threatActor = await getThreatActor(threatActorId);
  const allTtps = await getAllTtps();
  return <ThreatActorDetail allTtps={allTtps} threatActor={threatActor} />;
}
