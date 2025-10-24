import {
  Alert,
  AlertCategory,
  Asset,
  AssetUptime,
  ResponseAction,
  SshSession,
} from "@prisma/client";
import { User } from "next-auth";

export type PopulatedAsset = Asset & {
  assignedTeamMember?: User;
  sshSessions: SshSession[];
  alerts: (Alert & {
    category: AlertCategory;
    assignedInvestigator: User;
  })[];
  responseActions: (ResponseAction & { assignedTeamMember: User })[];
  assetUptimes?: AssetUptime[];
};
