import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getThreatActors } from "./threat-actor-actions";

export default function ThreatActorList({
  threatActors,
}: {
  threatActors: Awaited<ReturnType<typeof getThreatActors>>;
}) {
  return (
    <div>
      {" "}
      <div>
        {threatActors.map((ta) => (
          <div
            key={ta.id}
            className="mb-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Link
              href={`/threat-actors/${ta.id}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="font-medium">{ta.name}</div>
              </div>
              <div className="text-muted-foreground">View details →</div>
            </Link>
          </div>
        ))}
      </div>
      <Button asChild>
        <Link href="/threat-actors/create">Create Threat Actor</Link>
      </Button>
    </div>
  );
}
