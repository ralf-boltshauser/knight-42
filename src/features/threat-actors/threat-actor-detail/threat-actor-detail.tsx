"use client";
import { Button } from "@/components/ui/button";
import MittreAttackFramework from "@/features/attack-chains/mittre-attack-framework";
import { PopulatedTechnique } from "@/types/technique";
import { Edit2, Save } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getThreatActor,
  updateThreatActorNotes,
  updateThreatActorTechniques,
} from "../threat-actor-actions";

export default function ThreatActorDetail({
  threatActor,
  allTtps,
}: {
  allTtps: PopulatedTechnique[];
  threatActor: Awaited<ReturnType<typeof getThreatActor>>;
}) {
  if (!threatActor) return null;
  const [edit, setEdit] = useState(false);

  const [notes, setNotes] = useState(threatActor.notes ?? "");

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
    </div>
  );
}
