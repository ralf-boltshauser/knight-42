import AlertDetail from "@/features/alerts/alert-detail/alert-detail";
import { prisma } from "@/lib/client";
import { PopulatedAlert } from "@/types/alert";

export default async function AlertDetailPage({
  params: { alertId },
}: {
  params: { alertId: string };
}) {
  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
    include: {
      assets: true,
      category: true,
      assignedInvestigator: true,
      responseActions: {
        include: {
          assignedTeamMember: true,
          affectedAsset: true,
        },
      },
      relatedIOCs: {
        include: {
          type: true,
        },
      },
    },
  });

  return <AlertDetail alert={alert as PopulatedAlert} />;
}
