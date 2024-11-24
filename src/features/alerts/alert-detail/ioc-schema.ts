import { z } from "zod";

export const IOCSchema = z.object({
  typeId: z.string(),
  value: z.string(),
  dateFirstObserved: z.date(),
  notes: z.string().optional(),
});
