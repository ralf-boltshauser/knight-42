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
import { AssetType } from "@prisma/client";
import {
  AlertCircle,
  MoreHorizontal,
  Server,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

export default function AssetListItem({ asset }: { asset: PopulatedAsset }) {
  return (
    <Link href={`/assets/${asset.id}`}>
      <Card key={asset.id} className="hover:bg-accent transition-colors">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                {asset.type === AssetType.HOST ? (
                  <Server className="h-6 w-6 text-primary" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {asset.identifier}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`${getCriticalityColor(
                  asset.criticality
                )} text-white`}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security Assessment</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>View Alerts</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Asset
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
