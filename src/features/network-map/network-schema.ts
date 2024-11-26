import { NetworkColor } from "@prisma/client";
import { z } from "zod";

export const NetworkSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  ipRange: z.string(),
  fieldFrom: z.string(),
  fieldTo: z.string(),
  fieldLegend: z.string(),
  networkColor: z.nativeEnum(NetworkColor),
  parentNetworkId: z.string().optional(),
});
