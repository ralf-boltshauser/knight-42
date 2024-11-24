import { AssetCriticality, AssetType, AssetVisibility } from "@prisma/client";
import { z } from "zod";

export const AssetSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required."),
  identifier: z.string().min(1, "Identifier is required."),
  visibility: z.nativeEnum(AssetVisibility),
  metadata: z.any().optional(),
  criticality: z.nativeEnum(AssetCriticality),
  type: z.nativeEnum(AssetType),
  assignedTeamMemberId: z.string().nullable().optional(),
  notes: z.string().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
