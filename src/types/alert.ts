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
  assignedInvestigator: User;
  responseActions: PopulatedResponseAction[];
  relatedIOCs: (IOC & {
    type: IOCType;
  })[];
};

export type PopulatedResponseAction = ResponseAction & {
  assignedTeamMember: User;
};
