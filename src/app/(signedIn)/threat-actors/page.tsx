import { getThreatActors } from "@/features/threat-actors/threat-actor-actions";
import ThreatActorList from "@/features/threat-actors/threat-actor-list";

export default async function ThreatActorsPage() {
  const threatActors = await getThreatActors();
  return <ThreatActorList threatActors={threatActors} />;
}
