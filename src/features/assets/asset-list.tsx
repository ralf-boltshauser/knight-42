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
import {
  AlertStatus,
  AlertType,
  AssetCriticality,
  AssetType,
  AssetVisibility,
} from "@prisma/client";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  RotateCw,
  Server,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { useEffect, useState } from "react";
import { AssetForm } from "./asset-form";
import AssetListItem from "./asset-list-item";

export default function AssetList({ assets }: { assets: PopulatedAsset[] }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AssetType | null>(null);
  const [reload, setReload] = useQueryState(
    "reload",
    parseAsBoolean.withDefault(false)
  );
  const [onlyMine, setOnlyMine] = useQueryState(
    "onlyMine",
    parseAsBoolean.withDefault(false)
  );
  const [onlyUnderAttack, setOnlyUnderAttack] = useQueryState(
    "onlyUnderAttack",
    parseAsBoolean.withDefault(false)
  );
  const [criticalityFilter, setCriticalityFilter] = useQueryState(
    "criticalityFilter",
    parseAsArrayOf(
      parseAsStringEnum(Object.values(AssetCriticality))
    ).withDefault([])
  );
  const [visibilityFilter, setVisibilityFilter] = useQueryState(
    "visibilityFilter",
    parseAsArrayOf(
      parseAsStringEnum(Object.values(AssetVisibility))
    ).withDefault([])
  );

  const reloadInterval = 30;
  const [reloadCounter, setReloadCounter] = useState(reloadInterval);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reload) {
      interval = setInterval(() => {
        setReloadCounter((prev) => prev - 1);
      }, 1000);

      if (reloadCounter <= 0) {
        window.location.reload();
        setReloadCounter(reloadInterval);
      }
    }

    return () => clearInterval(interval);
  }, [reload, reloadCounter]);

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
            alert.type != AlertType.HARMLESS
        )) &&
      (criticalityFilter.length === 0 ||
        criticalityFilter.includes(asset.criticality)) &&
      (visibilityFilter.length === 0 ||
        visibilityFilter.includes(asset.visibility))
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="hidden md:flex flex-row justify-between items-center">
        <div className="flex flex-col xl:flex-row justify-start gap-8 items-center">
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
      <div className="hidden md:flex flex-row gap-16 justify-start items-center">
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
        <ToggleGroup
          type="multiple"
          onValueChange={(value) => {
            setCriticalityFilter(value as AssetCriticality[]);
          }}
        >
          <ToggleGroupItem value={AssetCriticality.LOW}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Low
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.MEDIUM}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Medium
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.HIGH}>
            <AlertCircle className="mr-2 h-4 w-4" />
            High
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.CRITICAL}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Critical
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          onValueChange={(value) => {
            setVisibilityFilter(value as AssetVisibility[]);
          }}
        >
          <ToggleGroupItem value={AssetVisibility.NONE}>
            <EyeOff className="mr-2 h-4 w-4" />
            None
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetVisibility.ALERTS}>
            <Eye className="mr-2 h-4 w-4" />
            Alerts
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetVisibility.FULL}>
            <Eye className="mr-2 h-4 w-4" />
            Full
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          variant="outline"
          onClick={() => setReload((prev) => !prev)}
          className="flex items-center"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          {reload
            ? `Stop Reload (${reloadCounter}s)`
            : `Auto Reload (${reloadInterval}s)`}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredAssets
          .toSorted(
            (a, b) =>
              Object.values(AssetCriticality).indexOf(b.criticality) -
              Object.values(AssetCriticality).indexOf(a.criticality)
          )
          .map((asset) => (
            <AssetListItem key={asset.id} asset={asset} />
          ))}
      </div>
    </div>
  );
}
