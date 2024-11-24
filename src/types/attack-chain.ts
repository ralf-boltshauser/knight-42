import { AttackChain, ThreatActor, User } from "@prisma/client";
import { PopulatedAlert } from "./alert";

export type PopulatedAttackChain = AttackChain & {
  alerts: PopulatedAlert[];
  analyst: User;
  relatedThreatActor: ThreatActor | null;
};
