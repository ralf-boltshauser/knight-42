import { Asset, Network } from "@prisma/client";

export type PopulatedNetwork = Omit<Network, "id"> & {
  assets: Asset[];
  subNetworks: PopulatedNetwork[];
};
