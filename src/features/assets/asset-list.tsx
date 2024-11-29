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
import { Sound } from "@/types/sounds";
import {
  AlertStatus,
  AlertType,
  AssetCriticality,
  AssetType,
  AssetVisibility,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  LayoutTemplate,
  Plus,
  RotateCw,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { useSound } from "use-sound";
import { useEasterEgg } from "../easter-eggs/easter-egg-context";
import { getAssets } from "./asset-actions";
import { AssetForm } from "./asset-form";
import AssetListItem from "./asset-list-item";
import EmptyAssetList from "./empty-asset-list";

export default function AssetList({
  initialAssets,
}: {
  initialAssets: PopulatedAsset[];
}) {
  const { data: session } = useSession();

  const [assets, setAssets] = useState<PopulatedAsset[]>(initialAssets);

  const { getSound } = useEasterEgg();
  const [play] = useSound(getSound(Sound.NOTIFICATION_1));

  const {
    data: updatedAssets,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(),
  });

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
  const [osFilter, setOsFilter] = useQueryState(
    "osFilter",
    parseAsArrayOf(parseAsStringEnum(["WINDOWS", "LINUX"])).withDefault([])
  );

  const reloadInterval = 15;
  const [reloadCounter, setReloadCounter] = useState(reloadInterval);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (reload) {
      interval = setInterval(() => {
        setReloadCounter((prev) => prev - 1);
      }, 1000);

      if (reloadCounter <= 0) {
        refetch();
        setReloadCounter(reloadInterval);
      }
    }

    return () => clearInterval(interval);
  }, [reload, reloadCounter, refetch]);

  const assetFilter = useCallback(
    (asset: PopulatedAsset) =>
      asset.alerts &&
      (filterType === null || asset.type === filterType) &&
      (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.identifier.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (onlyMine === false ||
        asset.assignedTeamMemberId === session?.user.dbId) &&
      (onlyUnderAttack === false ||
        asset.alerts.some(
          (alert) =>
            alert.status !== AlertStatus.RESOLVED &&
            alert.type != AlertType.HARMLESS
        )) &&
      (criticalityFilter.length === 0 ||
        criticalityFilter.includes(asset.criticality)) &&
      (visibilityFilter.length === 0 ||
        visibilityFilter.includes(asset.visibility)) &&
      (osFilter.length === 0 ||
        osFilter.some((os) =>
          JSON.stringify(asset.metadata)
            .toLowerCase()
            .includes(os.toLowerCase())
        )),
    [
      filterType,
      searchTerm,
      onlyMine,
      session?.user.dbId,
      onlyUnderAttack,
      criticalityFilter,
      visibilityFilter,
      osFilter,
    ]
  );

  useEffect(() => {
    if (isSuccess) {
      // check if it the updated assets are different from the current assets
      if (
        JSON.stringify(
          (updatedAssets as PopulatedAsset[]).filter(assetFilter)
        ) !== JSON.stringify(assets.filter(assetFilter))
      ) {
        console.log("updated assets", updatedAssets);
        play();
        setAssets(updatedAssets as PopulatedAsset[]);
      }
    }
  }, [updatedAssets, isSuccess, assets, play, assetFilter]);

  const filteredAssets = assets.filter(assetFilter);

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
              variant={
                filterType === AssetType.WINDOWS_SERVER ? "default" : "outline"
              }
              onClick={() => setFilterType(AssetType.WINDOWS_SERVER)}
            >
              <Server className="mr-2 h-4 w-4" />
              Hosts
            </Button>
            <Button
              variant={
                filterType === AssetType.WINDOWS_WORKSTATION
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilterType(AssetType.WINDOWS_WORKSTATION)}
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
          value={
            [
              onlyMine ? "mine" : undefined,
              onlyUnderAttack ? "under-attack" : undefined,
            ].filter(Boolean) as string[]
          }
          onValueChange={(value) => {
            setOnlyMine(value.includes("mine"));
            setOnlyUnderAttack(value.includes("under-attack"));
          }}
        >
          <ToggleGroupItem value="mine">
            <User className="mr-1 h-4 w-4" />
            Mine
          </ToggleGroupItem>
          <ToggleGroupItem value="under-attack">
            <Shield className="mr-1 h-4 w-4" />
            Under Attack
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          value={criticalityFilter}
          onValueChange={(value) => {
            setCriticalityFilter(value as AssetCriticality[]);
          }}
        >
          <ToggleGroupItem value={AssetCriticality.LOW}>
            <CheckCircle className="mr-1 h-4 w-4" />
            Low
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.MEDIUM}>
            <AlertCircle className="mr-1 h-4 w-4" />
            Medium
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.HIGH}>
            <AlertCircle className="mr-1 h-4 w-4" />
            High
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetCriticality.CRITICAL}>
            <ShieldAlert className="mr-1 h-4 w-4" />
            Critical
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="multiple"
          value={visibilityFilter}
          onValueChange={(value) => {
            setVisibilityFilter(value as AssetVisibility[]);
          }}
        >
          <ToggleGroupItem value={AssetVisibility.NONE}>
            <EyeOff className="mr-1 h-4 w-4" />
            None
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetVisibility.ALERTS}>
            <Eye className="mr-1 h-4 w-4" />
            Alerts
          </ToggleGroupItem>
          <ToggleGroupItem value={AssetVisibility.FULL}>
            <Eye className="mr-1 h-4 w-4" />
            Full
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          value={osFilter}
          onValueChange={(value) => {
            setOsFilter(value as string[]);
          }}
        >
          <ToggleGroupItem value="WINDOWS">
            <LayoutTemplate className="mr-1 h-4 w-4" />
            Windows
          </ToggleGroupItem>
          <ToggleGroupItem value="LINUX">
            <Terminal className="mr-1 h-4 w-4" />
            Linux
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          variant="outline"
          onClick={() => setReload((prev) => !prev)}
          className="flex items-center"
        >
          <RotateCw className="mr-1 h-4 w-4" />
          {reload
            ? `Stop Reload (${reloadCounter}s)`
            : `Auto Reload (${reloadInterval}s)`}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {filteredAssets.length === 0 && <EmptyAssetList />}
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
