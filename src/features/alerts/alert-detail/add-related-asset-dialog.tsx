"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addAssetsToAlert, getOutstandingAssets } from "../alert-actions";

export default function AddRelatedAssetDialog({ alert }: { alert: Alert }) {
  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getOutstandingAssets(alert),
  });

  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);

  const handleAddAssets = async () => {
    toast.info("Adding assets to alert...");
    await addAssetsToAlert(alert.id, selectedAssetIds);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Related Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-none w-fit">
        <DialogHeader>
          <DialogTitle>Add Related Asset</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          {assets?.map((asset) => (
            <div
              key={asset.id}
              className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => {
                if (selectedAssetIds.includes(asset.id)) {
                  setSelectedAssetIds(
                    selectedAssetIds.filter((id) => id !== asset.id)
                  );
                } else {
                  setSelectedAssetIds([...selectedAssetIds, asset.id]);
                }
              }}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={selectedAssetIds.includes(asset.id)}
                onChange={() => {}} // Handled by div onClick
              />
              <label className="text-sm text-nowrap font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {asset.name}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAddAssets}>Add</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
