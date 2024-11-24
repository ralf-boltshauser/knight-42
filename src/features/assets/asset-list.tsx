"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PopulatedAsset } from "@/types/asset";
import { AlertStatus, AlertType, AssetType } from "@prisma/client";
import { Plus, Server, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AssetForm } from "./asset-form";
import AssetListItem from "./asset-list-item";

export default function AssetList({ assets }: { assets: PopulatedAsset[] }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AssetType | null>(null);
  const [onlyMine, setOnlyMine] = useState(false);
  const [onlyUnderAttack, setOnlyUnderAttack] = useState(false);

  if (!session) return null;
  const filteredAssets = assets.filter(
    (asset) =>
      (filterType === null || asset.type === filterType) &&
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.identifier.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (onlyMine === false ||
        asset.assignedTeamMemberId === session.user.dbId) &&
      (onlyUnderAttack === false ||
        asset.alerts.some(
          (alert) =>
            alert.status !== AlertStatus.RESOLVED &&
            alert.type == AlertType.INCIDENT
        ))
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-start gap-8 items-center">
          <div className="relative w-[500px] sm:w-64">
            <Input
              placeholder="Search assets..."
              className=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === null ? "default" : "outline"}
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            <Button
              variant={filterType === AssetType.HOST ? "default" : "outline"}
              onClick={() => setFilterType(AssetType.HOST)}
            >
              <Server className="mr-2 h-4 w-4" />
              Hosts
            </Button>
            <Button
              variant={filterType === AssetType.USER ? "default" : "outline"}
              onClick={() => setFilterType(AssetType.USER)}
            >
              <User className="mr-2 h-4 w-4" />
              Users
            </Button>
          </div>
          <div>
            <ToggleGroup
              type="multiple"
              onValueChange={(value) => {
                setOnlyMine(value.includes("mine"));
                setOnlyUnderAttack(value.includes("under-attack"));
              }}
            >
              <ToggleGroupItem value="mine">
                <User className="mr-2 h-4 w-4" />
                Mine
              </ToggleGroupItem>
              <ToggleGroupItem value="under-attack">
                <Shield className="mr-2 h-4 w-4" />
                Under Attack
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Asset</DialogTitle>
            </DialogHeader>
            <AssetForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1  xl:grid-cols-2 gap-4">
        {filteredAssets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
