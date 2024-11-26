import { PrismaClient, Tactic } from "@prisma/client";

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
    { name: "Persistence Mechanism" },
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
    { name: "File Path" },
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

  const existingTechniques = await prisma.technique.findMany();

  if (existingTechniques.length === 0) {
    const techniques = [
      {
        name: "Active Scanning",
        ttpIdentifier: "T1595",
        tactic: Tactic.RECONNAISSANCE,
        order: 1,
        childrenTechniques: [
          {
            name: "Scanning IP Blocks",
            ttpIdentifier: "T1595.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Vulnerability Scanning",
            ttpIdentifier: "T1595.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Wordlist Scanning",
            ttpIdentifier: "T1595.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
        ],
      },
      {
        name: "Gather Victim Host Information",
        ttpIdentifier: "T1592",
        tactic: Tactic.RECONNAISSANCE,
        order: 2,
        childrenTechniques: [
          {
            name: "Hardware",
            ttpIdentifier: "T1592.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Software",
            ttpIdentifier: "T1592.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Firmware",
            ttpIdentifier: "T1592.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
          {
            name: "Client Configurations",
            ttpIdentifier: "T1592.004",
            tactic: Tactic.RECONNAISSANCE,
            order: 4,
          },
        ],
      },
      {
        name: "Gather Victim Identity Information",
        ttpIdentifier: "T1589",
        tactic: Tactic.RECONNAISSANCE,
        order: 3,
        childrenTechniques: [
          {
            name: "Credentials",
            ttpIdentifier: "T1589.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Email Addresses",
            ttpIdentifier: "T1589.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Employee Names",
            ttpIdentifier: "T1589.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
        ],
      },
      {
        name: "Gather Victim Network Information",
        ttpIdentifier: "T1590",
        tactic: Tactic.RECONNAISSANCE,
        order: 4,
        childrenTechniques: [
          {
            name: "Domain Properties",
            ttpIdentifier: "T1590.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "DNS",
            ttpIdentifier: "T1590.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Network Trust Dependencies",
            ttpIdentifier: "T1590.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
          {
            name: "Network Topology",
            ttpIdentifier: "T1590.004",
            tactic: Tactic.RECONNAISSANCE,
            order: 4,
          },
          {
            name: "IP Addresses",
            ttpIdentifier: "T1590.005",
            tactic: Tactic.RECONNAISSANCE,
            order: 5,
          },
          {
            name: "Network Security Appliances",
            ttpIdentifier: "T1590.006",
            tactic: Tactic.RECONNAISSANCE,
            order: 6,
          },
        ],
      },
      {
        name: "Gather Victim Organization Information",
        ttpIdentifier: "T1591",
        tactic: Tactic.RECONNAISSANCE,
        order: 5,
        childrenTechniques: [
          {
            name: "Determine Physical Locations",
            ttpIdentifier: "T1591.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Business Relationships",
            ttpIdentifier: "T1591.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Identify Business Tempo",
            ttpIdentifier: "T1591.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
          {
            name: "Identify Roles",
            ttpIdentifier: "T1591.004",
            tactic: Tactic.RECONNAISSANCE,
            order: 4,
          },
        ],
      },
      {
        name: "Phishing for Information",
        ttpIdentifier: "T1598",
        tactic: Tactic.RECONNAISSANCE,
        order: 6,
        childrenTechniques: [
          {
            name: "Spearphishing Service",
            ttpIdentifier: "T1598.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Spearphishing Attachment",
            ttpIdentifier: "T1598.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Spearphishing Link",
            ttpIdentifier: "T1598.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
          {
            name: "Spearphishing via Voice",
            ttpIdentifier: "T1598.004",
            tactic: Tactic.RECONNAISSANCE,
            order: 4,
          },
        ],
      },
      {
        name: "Search Closed Sources",
        ttpIdentifier: "T1597",
        tactic: Tactic.RECONNAISSANCE,
        order: 7,
        childrenTechniques: [
          {
            name: "Threat Intel Vendors",
            ttpIdentifier: "T1597.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Purchase Technical Data",
            ttpIdentifier: "T1597.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
        ],
      },
      {
        name: "Search Open Technical Databases",
        ttpIdentifier: "T1596",
        tactic: Tactic.RECONNAISSANCE,
        order: 8,
        childrenTechniques: [
          {
            name: "DNS/Passive DNS",
            ttpIdentifier: "T1596.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "WHOIS",
            ttpIdentifier: "T1596.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Digital Certificates",
            ttpIdentifier: "T1596.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
          {
            name: "CDNs",
            ttpIdentifier: "T1596.004",
            tactic: Tactic.RECONNAISSANCE,
            order: 4,
          },
          {
            name: "Scan Databases",
            ttpIdentifier: "T1596.005",
            tactic: Tactic.RECONNAISSANCE,
            order: 5,
          },
        ],
      },
      {
        name: "Search Open Websites/Domains",
        ttpIdentifier: "T1593",
        tactic: Tactic.RECONNAISSANCE,
        order: 9,
        childrenTechniques: [
          {
            name: "Social Media",
            ttpIdentifier: "T1593.001",
            tactic: Tactic.RECONNAISSANCE,
            order: 1,
          },
          {
            name: "Search Engines",
            ttpIdentifier: "T1593.002",
            tactic: Tactic.RECONNAISSANCE,
            order: 2,
          },
          {
            name: "Code Repositories",
            ttpIdentifier: "T1593.003",
            tactic: Tactic.RECONNAISSANCE,
            order: 3,
          },
        ],
      },
      {
        name: "Search Victim-Owned Websites",
        ttpIdentifier: "T1594",
        tactic: Tactic.RECONNAISSANCE,
        order: 11,
        childrenTechniques: [],
      },
      {
        name: "Acquire Access",
        ttpIdentifier: "T1580",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 1,
        childrenTechniques: [],
      },
      {
        name: "Acquire Infrastructure",
        ttpIdentifier: "T1583",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 2,
        childrenTechniques: [
          {
            name: "Domains",
            ttpIdentifier: "T1583.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "DNS Server",
            ttpIdentifier: "T1583.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Virtual Private Server",
            ttpIdentifier: "T1583.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
          {
            name: "Server",
            ttpIdentifier: "T1583.004",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 4,
          },
          {
            name: "Botnet",
            ttpIdentifier: "T1583.005",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 5,
          },
          {
            name: "Web Services",
            ttpIdentifier: "T1583.006",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 6,
          },
          {
            name: "Serverless",
            ttpIdentifier: "T1583.007",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 7,
          },
          {
            name: "Malvertising",
            ttpIdentifier: "T1583.008",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 8,
          },
        ],
      },
      {
        name: "Compromise Accounts",
        ttpIdentifier: "T1586",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 3,
        childrenTechniques: [
          {
            name: "Social Media Accounts",
            ttpIdentifier: "T1586.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "Email Accounts",
            ttpIdentifier: "T1586.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Cloud Accounts",
            ttpIdentifier: "T1586.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
        ],
      },
      // {
      //   name: "Compromise Infrastructure",
      //   ttpIdentifier: "T1584",
      //   tactic: Tactic.RESOURCE_DEVELOPMENT,
      //   order: 4,
      //   childrenTechniques: [
      //     {
      //       name: "Domains",
      //       ttpIdentifier: "T1584.001",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 1,
      //     },
      //     {
      //       name: "DNS Server",
      //       ttpIdentifier: "T1584.002",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 2,
      //     },
      //     {
      //       name: "Virtual Private Server",
      //       ttpIdentifier: "T1584.003",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 3,
      //     },
      //     {
      //       name: "Server",
      //       ttpIdentifier: "T1584.004",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 4,
      //     },
      //     {
      //       name: "Botnet",
      //       ttpIdentifier: "T1584.005",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 5,
      //     },
      //     {
      //       name: "Web Services",
      //       ttpIdentifier: "T1584.006",
      //       tactic: Tactic.RESOURCE_DEVELOPMENT,
      //       order: 6,
      //     },
      //   ],
      // },
      {
        name: "Establish Accounts",
        ttpIdentifier: "T1585",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 5,
        childrenTechniques: [
          {
            name: "Social Media Accounts",
            ttpIdentifier: "T1585.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "Email Accounts",
            ttpIdentifier: "T1585.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Cloud Accounts",
            ttpIdentifier: "T1585.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
        ],
      },
      {
        name: "Obtain Capabilities",
        ttpIdentifier: "T1588",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 6,
        childrenTechniques: [
          {
            name: "Malware",
            ttpIdentifier: "T1588.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "Tool",
            ttpIdentifier: "T1588.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Code Signing Certificates",
            ttpIdentifier: "T1588.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
          {
            name: "Digital Certificates",
            ttpIdentifier: "T1588.004",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 4,
          },
        ],
      },
      {
        name: "Compromise Infrastructure",
        ttpIdentifier: "T1584",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 7,
        childrenTechniques: [
          {
            name: "Domains",
            ttpIdentifier: "T1584.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "DNS Server",
            ttpIdentifier: "T1584.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Virtual Private Server",
            ttpIdentifier: "T1584.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
          {
            name: "Server",
            ttpIdentifier: "T1584.004",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 4,
          },
          {
            name: "Botnet",
            ttpIdentifier: "T1584.005",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 5,
          },
          {
            name: "Web Services",
            ttpIdentifier: "T1584.006",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 6,
          },
          {
            name: "Serverless",
            ttpIdentifier: "T1584.007",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 7,
          },
          {
            name: "Malvertising",
            ttpIdentifier: "T1584.008",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 8,
          },
        ],
      },
      {
        name: "Develop Capabilities",
        ttpIdentifier: "T1587",
        tactic: Tactic.RESOURCE_DEVELOPMENT,
        order: 8,
        childrenTechniques: [
          {
            name: "Malware",
            ttpIdentifier: "T1587.001",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 1,
          },
          {
            name: "Tool",
            ttpIdentifier: "T1587.002",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 2,
          },
          {
            name: "Code Signing Certificates",
            ttpIdentifier: "T1587.003",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 3,
          },
          {
            name: "Digital Certificates",
            ttpIdentifier: "T1587.004",
            tactic: Tactic.RESOURCE_DEVELOPMENT,
            order: 4,
          },
        ],
      },

      {
        name: "Drive-by Compromise",
        ttpIdentifier: "T1189",
        tactic: Tactic.INITIAL_ACCESS,
        order: 1,
        childrenTechniques: [],
      },
      {
        name: "Exploit Public-Facing Application",
        ttpIdentifier: "T1190",
        tactic: Tactic.INITIAL_ACCESS,
        order: 2,
        childrenTechniques: [],
      },
      {
        name: "External Remote Services",
        ttpIdentifier: "T1133",
        tactic: Tactic.INITIAL_ACCESS,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Hardware Additions",
        ttpIdentifier: "T1200",
        tactic: Tactic.INITIAL_ACCESS,
        order: 4,
        childrenTechniques: [],
      },
      {
        name: "Phishing",
        ttpIdentifier: "T1566",
        tactic: Tactic.INITIAL_ACCESS,
        order: 5,
        childrenTechniques: [
          {
            name: "Spearphishing Attachment",
            ttpIdentifier: "T1566.001",
            tactic: Tactic.INITIAL_ACCESS,
            order: 1,
          },
          {
            name: "Spearphishing Link",
            ttpIdentifier: "T1566.002",
            tactic: Tactic.INITIAL_ACCESS,
            order: 2,
          },
          {
            name: "Spearphishing via Service",
            ttpIdentifier: "T1566.003",
            tactic: Tactic.INITIAL_ACCESS,
            order: 3,
          },
        ],
      },
      {
        name: "Replication Through Removable Media",
        ttpIdentifier: "T1091",
        tactic: Tactic.INITIAL_ACCESS,
        order: 6,
        childrenTechniques: [],
      },
      {
        name: "Supply Chain Compromise",
        ttpIdentifier: "T1195",
        tactic: Tactic.INITIAL_ACCESS,
        order: 7,
        childrenTechniques: [
          {
            name: "Compromise Software Dependencies and Development Tools",
            ttpIdentifier: "T1195.001",
            tactic: Tactic.INITIAL_ACCESS,
            order: 1,
          },
          {
            name: "Compromise Software Supply Chain",
            ttpIdentifier: "T1195.002",
            tactic: Tactic.INITIAL_ACCESS,
            order: 2,
          },
          {
            name: "Compromise Hardware Supply Chain",
            ttpIdentifier: "T1195.003",
            tactic: Tactic.INITIAL_ACCESS,
            order: 3,
          },
        ],
      },
      {
        name: "Trusted Relationship",
        ttpIdentifier: "T1199",
        tactic: Tactic.INITIAL_ACCESS,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Valid Accounts",
        ttpIdentifier: "T1078",
        tactic: Tactic.INITIAL_ACCESS,
        order: 9,
        childrenTechniques: [
          {
            name: "Default Accounts",
            ttpIdentifier: "T1078.001",
            tactic: Tactic.INITIAL_ACCESS,
            order: 1,
          },
          {
            name: "Domain Accounts",
            ttpIdentifier: "T1078.002",
            tactic: Tactic.INITIAL_ACCESS,
            order: 2,
          },
          {
            name: "Local Accounts",
            ttpIdentifier: "T1078.003",
            tactic: Tactic.INITIAL_ACCESS,
            order: 3,
          },
          {
            name: "Cloud Accounts",
            ttpIdentifier: "T1078.004",
            tactic: Tactic.INITIAL_ACCESS,
            order: 4,
          },
        ],
      },
    ];

    for (const technique of techniques) {
      console.log(technique);
      await prisma.technique.create({
        data: {
          ...technique,
          childrenTechniques: {
            createMany: {
              data: technique.childrenTechniques.map((child) => ({
                ...child,
              })),
            },
          },
        },
      });
    }
  }

  // const hosts = [
  //   {
  //     id: "H1",
  //     name: "Web Server 1",
  //     identifier: "H-1",
  //     visibility: "FULL",
  //     metadata: {
  //       OS: "Ubuntu 22.04",
  //       IP: "192.168.1.10",
  //       location: "Data Center A",
  //     },
  //     criticality: "CRITICAL",
  //     type: "HOST",
  //     assignedTeamMemberId: null,
  //     notes: "Primary web server hosting the company website.",
  //     createdAt: "2024-11-24T12:00:00Z",
  //     updatedAt: "2024-11-24T12:00:00Z",
  //   },
  //   {
  //     id: "H2",
  //     name: "Database Server",
  //     identifier: "H-2",
  //     visibility: "ALERTS",
  //     metadata: {
  //       OS: "Windows Server 2019",
  //       IP: "192.168.1.20",
  //       location: "Data Center B",
  //     },
  //     criticality: "HIGH",
  //     type: "HOST",
  //     assignedTeamMemberId: null,
  //     notes: "Stores sensitive customer and transaction data.",
  //     createdAt: "2024-11-24T12:00:00Z",
  //     updatedAt: "2024-11-24T12:00:00Z",
  //   },
  //   {
  //     id: "H3",
  //     name: "Proxy Server",
  //     identifier: "H-3",
  //     visibility: "FULL",
  //     metadata: {
  //       OS: "Debian 11",
  //       IP: "192.168.1.30",
  //       location: "Data Center C",
  //     },
  //     criticality: "MEDIUM",
  //     type: "HOST",
  //     assignedTeamMemberId: null,
  //     notes: "Handles outbound traffic and anonymization.",
  //     createdAt: "2024-11-24T12:00:00Z",
  //     updatedAt: "2024-11-24T12:00:00Z",
  //   },
  //   {
  //     id: "H4",
  //     name: "User Account: Alice",
  //     identifier: "H-4",
  //     visibility: "NONE",
  //     metadata: {
  //       role: "Admin",
  //       department: "IT",
  //       lastLogin: "2024-11-20T09:00:00Z",
  //     },
  //     criticality: "CRITICAL",
  //     type: "USER",
  //     assignedTeamMemberId: null,
  //     notes: "Critical user account with admin privileges.",
  //     createdAt: "2024-11-24T12:00:00Z",
  //     updatedAt: "2024-11-24T12:00:00Z",
  //   },
  //   {
  //     id: "H5",
  //     name: "Development Workstation",
  //     identifier: "H-5",
  //     visibility: "ALERTS",
  //     metadata: {
  //       OS: "macOS Ventura",
  //       IP: "192.168.2.15",
  //       location: "Office Floor 2",
  //     },
  //     criticality: "LOW",
  //     type: "HOST",
  //     assignedTeamMemberId: null,
  //     notes: "Used by the software development team.",
  //     createdAt: "2024-11-24T12:00:00Z",
  //     updatedAt: "2024-11-24T12:00:00Z",
  //   },
  // ];

  // const existingHosts = await prisma.asset.findMany({
  //   where: {
  //     type: "HOST",
  //   },
  // });

  // if (existingHosts.length === 0) {
  //   await prisma.asset.createMany({
  //     data: [
  //       ...hosts.map((host) => ({
  //         ...host,
  //         visibility: host.visibility as AssetVisibility,
  //         criticality: host.criticality as AssetCriticality,
  //         type: host.type as AssetType,
  //       })),
  //     ],
  //   });

  //   const newHosts = await prisma.asset.findMany({
  //     where: {
  //       type: "HOST",
  //     },
  //   });

  //   const attackChain = await prisma.attackChain.create({
  //     data: {
  //       name: "Example Attack Chain",
  //       analyst: {
  //         create: {
  //           email: "test@test.com",
  //           name: "Test Analyst",
  //         },
  //       },
  //     },
  //   });

  //   const alerts = [
  //     {
  //       name: "Proxy Server Downtime",
  //       type: AlertType.INCIDENT,
  //       description:
  //         "The proxy server is experiencing downtime, causing disruptions in outbound traffic.",
  //       detectionSource: DetectionSource.OTHER,
  //       status: AlertStatus.ESCALATED,
  //       startDateTime: new Date("2024-11-24T10:00:00Z"),
  //       category: {
  //         connect: {
  //           name: "Service Downtime",
  //         },
  //       },
  //       relatedIOCs: {
  //         create: {
  //           type: {
  //             connect: {
  //               name: "IP Address",
  //             },
  //           },
  //           value: "192.168.1.30",
  //         },
  //       },
  //       assets: {
  //         connect: { id: "H3" }, // Proxy Server
  //       },
  //       assignedInvestigator: {
  //         connect: {
  //           email: "test@test.com",
  //         },
  //       },
  //     },
  //     {
  //       name: "Suspicious Error Logs in Web Server",
  //       type: AlertType.INCIDENT,
  //       description:
  //         "Error logs indicate unauthorized access attempts to sensitive endpoints on the web application.",
  //       detectionSource: DetectionSource.WAZUH,
  //       status: AlertStatus.INITIAL_INVESTIGATION,
  //       startDateTime: new Date("2024-11-24T10:30:00Z"),
  //       category: {
  //         connect: {
  //           name: "Unauthorized Access",
  //         },
  //       },
  //       assets: {
  //         connect: { id: "H1" }, // Web Server
  //       },
  //       relatedIOCs: {
  //         create: {
  //           type: {
  //             connect: {
  //               name: "IP Address",
  //             },
  //           },
  //           value: "192.168.1.10",
  //         },
  //       },
  //       assignedInvestigator: {
  //         connect: {
  //           email: "test@test.com",
  //         },
  //       },
  //     },
  //     {
  //       name: "Database Data Exfiltration",
  //       type: AlertType.INCIDENT,
  //       description:
  //         "Unusual query patterns suggest potential data exfiltration from the database server.",
  //       detectionSource: DetectionSource.VELOCIRAPTOR,
  //       status: AlertStatus.ESCALATED,
  //       startDateTime: new Date("2024-11-24T11:00:00Z"),
  //       category: {
  //         connect: {
  //           name: "Data Exfiltration",
  //         },
  //       },
  //       relatedIOCs: {
  //         create: {
  //           type: {
  //             connect: {
  //               name: "Email Address",
  //             },
  //           },
  //           value: "alice@example.com",
  //         },
  //       },
  //       assets: {
  //         connect: { id: "H2" }, // Database Server
  //       },
  //       assignedInvestigator: {
  //         connect: {
  //           email: "test@test.com",
  //         },
  //       },
  //     },
  //   ];

  //   for (const alert of alerts) {
  //     await prisma.alert.create({
  //       data: { ...alert, attackChain: { connect: { id: attackChain.id } } },
  //     });
  //   }
  // }
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
