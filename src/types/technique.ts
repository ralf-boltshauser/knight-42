import { Technique } from "@prisma/client";

export type PopulatedTechnique = Technique & {
  childrenTechniques: Technique[];
};
