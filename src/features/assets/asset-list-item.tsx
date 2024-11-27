import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PopulatedAsset } from "@/types/asset";
import { getCriticalityColor, getVisibilityBadge } from "@/types/asset-types";
import { AlertStatus, AlertType, AssetType } from "@prisma/client";
import { Eye, MoreHorizontal, Server, User } from "lucide-react";
import Link from "next/link";

import { deleteAsset } from "./asset-actions";
import AssetUptimeDisplay from "./asset-uptime-display";
export default function AssetListItem({ asset }: { asset: PopulatedAsset }) {
  console.log(asset.assetUptimes);
  const underAttack = asset.alerts.some(
    (alert) =>
      alert.status !== AlertStatus.RESOLVED && alert.type == AlertType.INCIDENT
  );

  const potentiallyUnderAttack = asset.alerts.some(
    (alert) =>
      alert.status !== AlertStatus.RESOLVED && alert.type == AlertType.ALERT
  );

  return (
    <Card key={asset.id} className={`hover:bg-accent transition-colors `}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center flex-row gap-2 justify-between w-full">
            <Link
              href={`/assets/${asset.id}`}
              className="flex items-center gap-2 flex-row justify-between "
            >
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  {asset.type === AssetType.WINDOWS_SERVER ? (
                    <Server className="h-6 w-6 text-primary" />
                  ) : (
                    <User className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>{asset.name}</span>
                    {underAttack && (
                      <Badge variant="destructive">Under Attack</Badge>
                    )}
                    {potentiallyUnderAttack && (
                      <Badge variant="orange">Potentially Under Attack</Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {asset.identifier}
                  </p>
                </div>
              </div>
            </Link>
            {asset.assetUptimes && asset.assetUptimes.length > 0 && (
              <AssetUptimeDisplay
                assetUptimes={asset.assetUptimes}
                limit={10}
              />
            )}
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`bg-${getCriticalityColor(
                    asset.criticality
                  )}-500 text-white`}
                >
                  {asset.criticality}
                </Badge>
                {getVisibilityBadge(asset.visibility)}
                {asset.assignedTeamMember && asset.assignedTeamMember.name && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {asset.assignedTeamMember.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {asset.assignedTeamMember.name}
                    </span>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/assets/${asset.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View Asset</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" asChild>
                    <form action={deleteAsset}>
                      <input type="hidden" name="id" value={asset.id} />
                      <button type="submit">Delete</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
