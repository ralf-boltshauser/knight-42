"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IOCType } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { badgeImportIOCs, getThreatActor } from "../threat-actor-actions";

export default function CreateThreatActorIOCs({
  threatActor,
}: {
  threatActor: Awaited<ReturnType<typeof getThreatActor>>;
}) {
  const [domains, setDomains] = useState<string[]>([]);
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);

  const cleanInput = (input: string) => {
    return input.replaceAll("[", "").replaceAll("]", "").split("\n");
  };

  if (!threatActor) {
    return null;
  }
  const handleImport = async () => {
    await badgeImportIOCs(threatActor.id, domains, IOCType.DOMAIN);
    await badgeImportIOCs(threatActor.id, ipAddresses, [
      IOCType.IP_SRC,
      IOCType.IP_DST,
    ]);
    toast.success("IOCs imported successfully");
    setDomains([]);
    setIpAddresses([]);
  };

  return (
    <div className="space-y-2 mt-2">
      <div className="flex flex-col gap-2">
        <h2>Domains Badge Import</h2>
        <Textarea
          placeholder="Enter domains, one per line"
          value={domains.join("\n")}
          onChange={(e) => setDomains(cleanInput(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2>IP Address Import</h2>
        <Textarea
          placeholder="Enter IP addresses, one per line"
          value={ipAddresses.join("\n")}
          onChange={(e) => setIpAddresses(cleanInput(e.target.value))}
        />
      </div>
      <Button onClick={handleImport}>Import All</Button>
    </div>
  );
}
