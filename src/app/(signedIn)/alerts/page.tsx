import AlertList from "@/features/alerts/alert-list";
import { prisma } from "@/lib/client";
import { PopulatedAlert } from "@/types/alert";
import { AlertStatus } from "@prisma/client";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    where: {
      status: {
        not: AlertStatus.RESOLVED,
      },
    },
    include: {
      assets: true,
      category: true,
      assignedInvestigator: true,
      responseActions: {
        include: {
          assignedTeamMember: true,
        },
      },
      relatedIOCs: {
        include: {
          type: true,
        },
      },
    },
  });

  return <AlertList alerts={alerts as PopulatedAlert[]} />;
}
