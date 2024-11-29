import { IOCType } from "@prisma/client";
import { z } from "zod";

export const IOCSchema = z.object({
  type: z.nativeEnum(IOCType),
  value: z.string(),
  dateFirstObserved: z.date(),
  notes: z.string().optional(),
});
