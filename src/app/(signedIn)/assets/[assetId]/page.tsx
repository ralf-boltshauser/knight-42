import AssetDetail from "@/features/assets/asset-detail/asset-detail";
import { getAssetById } from "@/features/assets/asset-detail/asset-detail-actions";
import { PopulatedAsset } from "@/types/asset";
import { notFound } from "next/navigation";
export default async function AssetDetailPage({
  params: { assetId },
}: {
  params: { assetId: string };
}) {
  const asset = await getAssetById(assetId);
  if (!asset) {
    notFound();
  }

  return <AssetDetail asset={asset as PopulatedAsset} />;
}
