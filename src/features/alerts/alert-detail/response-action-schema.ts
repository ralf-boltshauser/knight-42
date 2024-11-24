import { ResponseActionStatus, ResponseActionType } from "@prisma/client";
import { z } from "zod";

export const ResponseActionSchema = z.object({
  name: z.string().min(1),
  actionType: z.nativeEnum(ResponseActionType),
  status: z.nativeEnum(ResponseActionStatus),
  dateTime: z.date(),
  description: z.string().optional(),
  affectedAssetId: z.string().optional(),
  relatedIOCId: z.string().optional(),
  assignedTeamMemberId: z.string().optional(),
});
