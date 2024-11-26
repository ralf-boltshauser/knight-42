"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThreatActor } from "@prisma/client";
import { useState } from "react";
import { linkThreatActorToAttackChain } from "../attack-chain-actions";

export default function LinkThreatActor({
  threatActors,
  attackChainId,
}: {
  threatActors: ThreatActor[];
  attackChainId: string;
}) {
  const [selectedThreatActor, setSelectedThreatActor] = useState<string | null>(
    null
  );
  const handleSubmit = async () => {
    if (!selectedThreatActor) return;
    await linkThreatActorToAttackChain(attackChainId, selectedThreatActor);
  };
  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedThreatActor ?? undefined}
        onValueChange={setSelectedThreatActor}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a threat actor" />
        </SelectTrigger>
        <SelectContent>
          {threatActors.map((threatActor) => (
            <SelectItem key={threatActor.id} value={threatActor.id}>
              {threatActor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit}>Link Threat Actor</Button>
    </div>
  );
}
