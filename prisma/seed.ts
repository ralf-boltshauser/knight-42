import {
  AlertStatus,
  AlertType,
  AssetCriticality,
  AssetType,
  AssetVisibility,
  DetectionSource,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alertCategories = [
    { name: "Service Downtime" },
    { name: "Unauthorized Access" },
    { name: "Suspicious Traffic" },
    { name: "Data Exfiltration" },
    { name: "Malware Detection" },
    { name: "Privilege Escalation" },
    { name: "Denial of Service" },
    { name: "Exploited Vulnerability" },
  ];

  // check if alert categories count == 0
  const alertCategoriesCount = await prisma.alertCategory.count();
  if (alertCategoriesCount === 0) {
    await prisma.alertCategory.createMany({
      data: alertCategories,
    });
  }

  const iocTypes = [
    { name: "IP Address" },
    { name: "Domain" },
    { name: "File Hash" },
    { name: "URL" },
    { name: "Email Address" },
    { name: "Registry Key" },
    { name: "Process Name" },
  ];

  // check if ioc types count == 0
  const iocTypesCount = await prisma.iOCType.count();
  if (iocTypesCount === 0) {
    await prisma.iOCType.createMany({
      data: iocTypes,
    });
  }

  const hosts = [
    {
      id: "H1",
      name: "Web Server 1",
      identifier: "H-1",
      visibility: "FULL",
      metadata: {
        OS: "Ubuntu 22.04",
        IP: "192.168.1.10",
        location: "Data Center A",
      },
      criticality: "CRITICAL",
      type: "HOST",
      assignedTeamMemberId: null,
      notes: "Primary web server hosting the company website.",
      createdAt: "2024-11-24T12:00:00Z",
      updatedAt: "2024-11-24T12:00:00Z",
    },
    {
      id: "H2",
      name: "Database Server",
      identifier: "H-2",
      visibility: "ALERTS",
      metadata: {
        OS: "Windows Server 2019",
        IP: "192.168.1.20",
        location: "Data Center B",
      },
      criticality: "HIGH",
      type: "HOST",
      assignedTeamMemberId: null,
      notes: "Stores sensitive customer and transaction data.",
      createdAt: "2024-11-24T12:00:00Z",
      updatedAt: "2024-11-24T12:00:00Z",
    },
    {
      id: "H3",
      name: "Proxy Server",
      identifier: "H-3",
      visibility: "FULL",
      metadata: {
        OS: "Debian 11",
        IP: "192.168.1.30",
        location: "Data Center C",
      },
      criticality: "MEDIUM",
      type: "HOST",
      assignedTeamMemberId: null,
      notes: "Handles outbound traffic and anonymization.",
      createdAt: "2024-11-24T12:00:00Z",
      updatedAt: "2024-11-24T12:00:00Z",
    },
    {
      id: "H4",
      name: "User Account: Alice",
      identifier: "H-4",
      visibility: "NONE",
      metadata: {
        role: "Admin",
        department: "IT",
        lastLogin: "2024-11-20T09:00:00Z",
      },
      criticality: "CRITICAL",
      type: "USER",
      assignedTeamMemberId: null,
      notes: "Critical user account with admin privileges.",
      createdAt: "2024-11-24T12:00:00Z",
      updatedAt: "2024-11-24T12:00:00Z",
    },
    {
      id: "H5",
      name: "Development Workstation",
      identifier: "H-5",
      visibility: "ALERTS",
      metadata: {
        OS: "macOS Ventura",
        IP: "192.168.2.15",
        location: "Office Floor 2",
      },
      criticality: "LOW",
      type: "HOST",
      assignedTeamMemberId: null,
      notes: "Used by the software development team.",
      createdAt: "2024-11-24T12:00:00Z",
      updatedAt: "2024-11-24T12:00:00Z",
    },
  ];

  const existingHosts = await prisma.asset.findMany({
    where: {
      type: "HOST",
    },
  });

  if (existingHosts.length === 0) {
    await prisma.asset.createMany({
      data: [
        ...hosts.map((host) => ({
          ...host,
          visibility: host.visibility as AssetVisibility,
          criticality: host.criticality as AssetCriticality,
          type: host.type as AssetType,
        })),
      ],
    });

    const newHosts = await prisma.asset.findMany({
      where: {
        type: "HOST",
      },
    });

    const attackChain = await prisma.attackChain.create({
      data: {
        name: "Example Attack Chain",
        analyst: {
          create: {
            email: "test@test.com",
            name: "Test Analyst",
          },
        },
      },
    });

    const alerts = [
      {
        name: "Proxy Server Downtime",
        type: AlertType.INCIDENT,
        description:
          "The proxy server is experiencing downtime, causing disruptions in outbound traffic.",
        detectionSource: DetectionSource.OTHER,
        status: AlertStatus.ESCALATED,
        startDateTime: new Date("2024-11-24T10:00:00Z"),
        category: {
          connect: {
            name: "Service Downtime",
          },
        },
        relatedIOCs: {
          create: {
            type: {
              connect: {
                name: "IP Address",
              },
            },
            value: "192.168.1.30",
          },
        },
        assets: {
          connect: { id: "H3" }, // Proxy Server
        },
        assignedInvestigator: {
          connect: {
            email: "test@test.com",
          },
        },
      },
      {
        name: "Suspicious Error Logs in Web Server",
        type: AlertType.INCIDENT,
        description:
          "Error logs indicate unauthorized access attempts to sensitive endpoints on the web application.",
        detectionSource: DetectionSource.WAZUH,
        status: AlertStatus.INITIAL_INVESTIGATION,
        startDateTime: new Date("2024-11-24T10:30:00Z"),
        category: {
          connect: {
            name: "Unauthorized Access",
          },
        },
        assets: {
          connect: { id: "H1" }, // Web Server
        },
        relatedIOCs: {
          create: {
            type: {
              connect: {
                name: "IP Address",
              },
            },
            value: "192.168.1.10",
          },
        },
        assignedInvestigator: {
          connect: {
            email: "test@test.com",
          },
        },
      },
      {
        name: "Database Data Exfiltration",
        type: AlertType.INCIDENT,
        description:
          "Unusual query patterns suggest potential data exfiltration from the database server.",
        detectionSource: DetectionSource.VELOCIRAPTOR,
        status: AlertStatus.ESCALATED,
        startDateTime: new Date("2024-11-24T11:00:00Z"),
        category: {
          connect: {
            name: "Data Exfiltration",
          },
        },
        relatedIOCs: {
          create: {
            type: {
              connect: {
                name: "Email Address",
              },
            },
            value: "alice@example.com",
          },
        },
        assets: {
          connect: { id: "H2" }, // Database Server
        },
        assignedInvestigator: {
          connect: {
            email: "test@test.com",
          },
        },
      },
    ];

    for (const alert of alerts) {
      await prisma.alert.create({
        data: { ...alert, attackChain: { connect: { id: attackChain.id } } },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
