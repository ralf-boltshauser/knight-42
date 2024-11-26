import MittreAttackFramework from "@/features/attack-chains/mittre-attack-framework";
import { getAllTtps } from "@/features/techniques/technique-actions";
import { getThreatActor } from "../threat-actor-actions";

export default async function ThreatActorDetail({
  threatActor,
}: {
  threatActor: Awaited<ReturnType<typeof getThreatActor>>;
}) {
  if (!threatActor) return null;

  const allTtps = await getAllTtps();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{threatActor.name}</h1>
      <h2 className="text-lg font-bold mb-3">Notes</h2>
      <div className="text-muted-foreground my-5 w-full">
        <div
          dangerouslySetInnerHTML={{ __html: threatActor.notes ?? "" }}
          className="prose w-full"
        ></div>
      </div>

      {threatActor.techniques.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Techniques</h2>
          <div className="flex flex-col gap-2">
            <MittreAttackFramework
              allTtps={allTtps}
              ttps={threatActor.techniques}
            />
          </div>
        </div>
      )}
    </div>
  );
}
