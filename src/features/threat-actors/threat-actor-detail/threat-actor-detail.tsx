"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MittreAttackFramework from "@/features/attack-chains/mittre-attack-framework";
import { PopulatedTechnique } from "@/types/technique";
import { Edit2, Save } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import {
  getThreatActor,
  updateThreatActorNotes,
  updateThreatActorTechniques,
} from "../threat-actor-actions";
import CreateThreatActorIOCs from "./create-threat-actor-iocs";

export default function ThreatActorDetail({
  threatActor,
  allTtps,
}: {
  allTtps: PopulatedTechnique[];
  threatActor: Awaited<ReturnType<typeof getThreatActor>>;
}) {
  const [edit, setEdit] = useState(false);

  const [tab, setTab] = useQueryState("tab", { defaultValue: "techniques" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copy, setCopy] = useCopyToClipboard();

  const handleCopy = (value: string) => {
    setCopy(value);
    toast.success("Copied to clipboard");
  };

  const [notes, setNotes] = useState(threatActor?.notes ?? "");
  if (!threatActor) return null;

  const handleSetEdit = (bool: boolean) => {
    setEdit(bool);
    if (!bool) {
      handleSave();
    }
  };

  const handleSave = async () => {
    await updateThreatActorNotes(threatActor.id, notes);
    setEdit(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">{threatActor.name}</h1>
      <div className="flex items-center  mb-3 justify-start gap-4">
        <h2 className="text-lg font-bold">Notes</h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleSetEdit(!edit)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {edit ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </div>
      <div className="text-muted-foreground my-5 w-full">
        {edit ? (
          <ReactQuill
            value={notes}
            onChange={(value) => setNotes(value)}
            modules={{
              toolbar: [
                ["bold", "italic", "underline", "strike", "blockquote"],
              ],
            }}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: threatActor.notes ?? "" }}
            className="prose w-full"
            onClick={() => handleSetEdit(true)}
          ></div>
        )}
      </div>

      <Tabs onValueChange={(value) => setTab(value)} value={tab}>
        <TabsList>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
          <TabsTrigger value="iocs">IOCs</TabsTrigger>
        </TabsList>
        <TabsContent value="techniques">
          {threatActor.techniques.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3">Techniques</h2>
              <div className="flex flex-col gap-2">
                <MittreAttackFramework
                  allTtps={allTtps}
                  ttps={threatActor.techniques}
                  onUpdate={async (ttpId) => {
                    await updateThreatActorTechniques(threatActor.id, ttpId);
                  }}
                />
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="iocs">
          <div>
            <h2 className="text-lg font-bold mb-3">IOCs</h2>
            <div className="grid grid-cols-2 gap-2">
              {threatActor.iocs.map((ioc) => (
                <div
                  key={ioc.id}
                  className="flex gap-2 items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100 border border-gray-200"
                  onClick={() => handleCopy(ioc.value)}
                >
                  <div className="flex gap-2 items-center">
                    {ioc.type && <Badge>{ioc.type.name}</Badge>}
                    <Badge>{ioc.value}</Badge>
                  </div>
                  <div className="flex gap-2 items-center">
                    {ioc.linkedAlerts.map((alert) => (
                      <Badge key={alert.id} variant="outline">
                        {alert.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <CreateThreatActorIOCs threatActor={threatActor} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
