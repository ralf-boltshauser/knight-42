import {
  Alert,
  AlertCategory,
  Asset,
  AssetUptime,
  ResponseAction,
} from "@prisma/client";
import { User } from "next-auth";

export type PopulatedAsset = Asset & {
  assignedTeamMember?: User;
  alerts: (Alert & {
    category: AlertCategory;
    assignedInvestigator: User;
  })[];
  responseActions: (ResponseAction & { assignedTeamMember: User })[];
  assetUptimes?: AssetUptime[];
};
