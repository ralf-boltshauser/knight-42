import Dashboard from "@/features/dashboard/dashboard";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }
  const myAlerts = await prisma.alert.findMany({
    where: {
      assignedInvestigatorId: session.user.dbId,
    },
  });

  const myAssets = await prisma.asset.findMany({
    where: {
      assignedTeamMemberId: session.user.dbId,
    },
  });

  const myResponseActions = await prisma.responseAction.findMany({
    where: {
      assignedTeamMemberId: session.user.dbId,
    },
  });

  return (
    <Dashboard
      myAlerts={myAlerts}
      myAssets={myAssets}
      myResponseActions={myResponseActions}
    />
  );
}
