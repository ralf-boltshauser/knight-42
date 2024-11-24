import AssetList from "@/features/assets/asset-list";
import { prisma } from "@/lib/client";
import { PopulatedAsset } from "@/types/asset";

export default async function AssetsPage() {
  const assetList = await prisma.asset.findMany({
    include: {
      assignedTeamMember: true,
      alerts: {
        include: {
          category: true,
          assignedInvestigator: true,
        },
      },
      responseActions: {
        include: {
          assignedTeamMember: true,
        },
      },
    },
  });
  return <AssetList assets={assetList as PopulatedAsset[]} />;
}
