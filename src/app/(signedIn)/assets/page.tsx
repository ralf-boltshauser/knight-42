import { getAssets } from "@/features/alerts/alert-actions";
import AssetList from "@/features/assets/asset-list";
import { PopulatedAsset } from "@/types/asset";

export default async function AssetsPage() {
  const assetList = await getAssets();
  return <AssetList initialAssets={assetList as PopulatedAsset[]} />;
}
