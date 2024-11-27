import CreateNetworkFormDialog from "@/features/network-map/create-network-form";
import { getNetworkMapAssets } from "@/features/network-map/network-actions";
import NetworkMap from "@/features/network-map/network-map";
import { NetworkMapProvider } from "@/features/network-map/network-map-context";
import { prisma } from "@/lib/client";

export default async function NetworkMapPage() {
  const networks = await prisma.network.findMany();
  const assets = await getNetworkMapAssets();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Network Map</h2>
        <CreateNetworkFormDialog />
      </div>
      <NetworkMapProvider>
        <NetworkMap networks={networks} assets={assets} />
      </NetworkMapProvider>
    </div>
  );
}
