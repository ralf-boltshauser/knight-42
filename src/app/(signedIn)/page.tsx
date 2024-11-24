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
    include: {
      assignedInvestigator: true,
    },
  });

  const myResponseActions = await prisma.responseAction.findMany({
    include: {
      assignedTeamMember: true,
    },
  });

  return (
    <Dashboard myAlerts={myAlerts} myResponseActions={myResponseActions} />
  );
}
