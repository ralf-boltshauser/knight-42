"use server";
import { prisma } from "@/lib/client";
import { PopulatedNetwork } from "@/types/network";

export async function populateNetwork({
  populatedNetworks,
  parentId,
}: {
  populatedNetworks: PopulatedNetwork[];
  parentId?: string;
}) {
  // i have nested networks with assets etc create all of it in the db do it recursive
  for (const network of populatedNetworks) {
    const networkRes = await prisma.network.create({
      data: {
        ...network,
        parentNetworkId: parentId || undefined,
        subNetworks: undefined,
        assets: {
          createMany: {
            data: network.assets.map((asset) => ({
              ...asset,
              metadata: undefined,
            })),
          },
        },
      },
    });

    if (!network.subNetworks) {
      return;
    }

    for (const subNetwork of network.subNetworks) {
      await populateNetwork({
        populatedNetworks: [subNetwork],
        parentId: networkRes.id,
      });
    }
  }
}
