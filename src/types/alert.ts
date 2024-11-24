import {
  Alert,
  AlertCategory,
  Asset,
  IOC,
  IOCType,
  ResponseAction,
} from "@prisma/client";
import { User } from "next-auth";

export type PopulatedAlert = Alert & {
  assets: Asset[];
  category: AlertCategory;
  assignedInvestigator: User | null;
  responseActions: PopulatedResponseAction[];
  relatedIOCs: (IOC & {
    type: IOCType;
  })[];
};

export type PopulatedResponseAction = ResponseAction & {
  assignedTeamMember: User | null;
};

export type AttackChainAlert = Alert & {
  assets: Asset[];
};
