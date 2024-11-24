import { AlertStatus, AlertType, DetectionSource } from "@prisma/client";
import { z } from "zod";

export const AlertSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required."),
  type: z.nativeEnum(AlertType),
  startDateTime: z.date().default(new Date()),
  endDateTime: z.date().nullable().optional(),
  assets: z.array(z.string()).optional(),
  detectionSource: z.nativeEnum(DetectionSource),
  categoryId: z.string(),
  status: z.nativeEnum(AlertStatus),
  description: z.string().default(""),
  relatedIOCs: z.array(z.string()).optional(),
  attackChainId: z.string().nullable().optional(),
  responseActions: z.array(z.string()).optional(),
  assignedInvestigatorId: z.string().nullable().optional(),
});
