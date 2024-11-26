import { z } from "zod";

export const ThreatActorSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required."),
  notes: z.string().default(""),
  techniques: z.array(z.string()).optional(),
  linkedAttackChains: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
