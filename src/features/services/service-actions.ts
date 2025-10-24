"use server";
import { prisma } from "@/lib/client";

export type HealthStatus = "UP" | "DEGRADED" | "DOWN";

export async function getAllServices() {
  const services = await prisma.service.findMany({
    include: {
      rootGroup: true,
    },
    orderBy: {
      missionCritical: "desc",
    },
  });

  // Calculate service health based on dependency groups
  return Promise.all(
    services.map(async (service) => ({
      ...service,
      healthStatus: service.rootGroup
        ? await calculateGroupHealthRecursive(service.rootGroup.id)
        : "UP",
    }))
  );
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      rootGroup: true,
    },
  });

  if (!service || !service.rootGroup) return null;

  // Recursively fetch the complete dependency tree
  const rootGroupWithTree = await fetchGroupWithTree(service.rootGroup.id);

  return {
    ...service,
    rootGroup: rootGroupWithTree,
    healthStatus: await calculateGroupHealthRecursive(service.rootGroup.id),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchGroupWithTree(groupId: string): Promise<any> {
  const group = await prisma.dependencyGroup.findUnique({
    where: { id: groupId },
    include: {
      items: {
        include: {
          component: {
            include: {
              hosting: {
                include: {
                  asset: {
                    include: {
                      assetUptimes: {
                        orderBy: { timestamp: "desc" },
                        take: 1, // Get only the latest uptime record
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      childGroups: true,
    },
  });

  if (!group) return null;

  // Recursively fetch child groups
  const childGroupsWithTree = await Promise.all(
    group.childGroups.map((childGroup) => fetchGroupWithTree(childGroup.id))
  );

  return {
    ...group,
    childGroups: childGroupsWithTree,
  };
}

async function calculateGroupHealthRecursive(
  groupId: string
): Promise<HealthStatus> {
  // Get the group with its operator
  const group = await prisma.dependencyGroup.findUnique({
    where: { id: groupId },
    select: { operator: true },
  });

  if (!group) return "UP";

  // Get all components in this group
  const components = await prisma.dependencyItem.findMany({
    where: { dependencyGroupId: groupId },
    select: { component: { select: { isUp: true } } },
  });

  // Get all child groups
  const childGroups = await prisma.dependencyGroup.findMany({
    where: { parentGroupId: groupId },
    select: { id: true },
  });

  // Calculate health of components
  const componentHealth = components.map((item) => item.component.isUp);

  // Calculate health of child groups recursively
  const childGroupHealth = await Promise.all(
    childGroups.map((childGroup) =>
      calculateGroupHealthRecursive(childGroup.id)
    )
  );

  // Convert child group health to boolean for processing
  const childGroupHealthBooleans = childGroupHealth.map((health) =>
    health === "UP" ? true : false
  );

  // Combine all health values
  const allHealthValues = [...componentHealth, ...childGroupHealthBooleans];
  const allHealthStatuses = [
    ...componentHealth.map((up) => (up ? "UP" : "DOWN")),
    ...childGroupHealth,
  ];

  if (allHealthValues.length === 0) return "UP";

  // Apply operator logic
  if (group.operator === "AND") {
    // AND Logic: UP if all up, DOWN if any down, DEGRADED if some degraded but none down
    if (allHealthStatuses.every((status) => status === "UP")) return "UP";
    if (allHealthStatuses.some((status) => status === "DOWN")) return "DOWN";
    return "DEGRADED";
  } else {
    // OR Logic: UP if all up, DOWN if all down, DEGRADED if some up and some down
    if (allHealthStatuses.every((status) => status === "UP")) return "UP";
    if (allHealthStatuses.every((status) => status === "DOWN")) return "DOWN";
    return "DEGRADED";
  }
}

export async function getAssetHealthStatus(
  assetId: string
): Promise<HealthStatus> {
  const latestUptime = await prisma.assetUptime.findFirst({
    where: { assetId },
    orderBy: { timestamp: "desc" },
  });

  if (!latestUptime) return "UP"; // Default to UP if no data

  return latestUptime.up ? "UP" : "DOWN";
}

export async function updateComponentStatus(
  componentId: string,
  isUp: boolean
) {
  return await prisma.component.update({
    where: { id: componentId },
    data: { isUp },
  });
}

export async function updateComponentStatusAction(
  componentId: string,
  isUp: boolean
) {
  try {
    await updateComponentStatus(componentId, isUp);
    return { success: true };
  } catch (error) {
    console.error("Failed to update component status:", error);
    return { success: false, error: "Failed to update component status" };
  }
}
