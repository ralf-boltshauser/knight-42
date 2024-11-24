"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopulatedAsset } from "@/types/asset";
import { AssetType } from "@prisma/client";
import { Server, User } from "lucide-react";
import { useState } from "react";
import AssetListItem from "./asset-list-item";

export default function AssetList({ assets }: { assets: PopulatedAsset[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AssetType | null>(null);

  const filteredAssets = assets.filter(
    (asset) =>
      (filterType === null || asset.type === filterType) &&
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.identifier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
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
      </div>
      <div className="grid grid-cols-1  xl:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
