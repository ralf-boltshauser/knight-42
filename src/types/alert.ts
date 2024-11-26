import {
  Alert,
  AlertCategory,
  Asset,
  IOC,
  IOCType,
  ResponseAction,
  Technique,
} from "@prisma/client";
import { User } from "next-auth";

export type PopulatedAlert = Alert & {
  assets: Asset[];
  category: AlertCategory;
  technique: Technique | null;
  assignedInvestigator: User | null;
  responseActions: PopulatedResponseAction[];
  relatedIOCs: (IOC & {
    type: IOCType;
  })[];
};

export type PopulatedResponseAction = ResponseAction & {
  assignedTeamMember: User | null;
  affectedAsset: Asset | null;
};

export type AttackChainAlert = Alert & {
  assets: Asset[];
};
