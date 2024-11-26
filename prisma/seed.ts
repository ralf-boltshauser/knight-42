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
        ttpIdentifier: "T1650",
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
      // {
      //   name: "Replication Through Removable Media",
      //   ttpIdentifier: "T1091",
      //   tactic: Tactic.INITIAL_ACCESS,
      //   order: 6,
      //   childrenTechniques: [],
      // },
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
      {
        name: "Adversary-in-the-Middle",
        ttpIdentifier: "T1557",
        tactic: Tactic.COLLECTION,
        order: 1,
        childrenTechniques: [
          {
            name: "LLMNR/NBT-NS Poisoning and SMB Relay",
            ttpIdentifier: "T1557.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "ARP Cache Poisoning",
            ttpIdentifier: "T1557.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
          {
            name: "DHCP Spoofing",
            ttpIdentifier: "T1557.003",
            tactic: Tactic.COLLECTION,
            order: 3,
          },
          {
            name: "Evil Twin",
            ttpIdentifier: "T1557.004",
            tactic: Tactic.COLLECTION,
            order: 4,
          },
        ],
      },
      {
        name: "Archive Collected Data",
        ttpIdentifier: "T1560",
        tactic: Tactic.COLLECTION,
        order: 2,
        childrenTechniques: [
          {
            name: "Archive via Utility",
            ttpIdentifier: "T1560.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "Archive via Library",
            ttpIdentifier: "T1560.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
          {
            name: "Archive via Custom Method",
            ttpIdentifier: "T1560.003",
            tactic: Tactic.COLLECTION,
            order: 3,
          },
        ],
      },
      {
        name: "Audio Capture",
        ttpIdentifier: "T1123",
        tactic: Tactic.COLLECTION,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Automated Collection",
        ttpIdentifier: "T1119",
        tactic: Tactic.COLLECTION,
        order: 4,
        childrenTechniques: [],
      },
      {
        name: "Browser Session Hijacking",
        ttpIdentifier: "T1185",
        tactic: Tactic.COLLECTION,
        order: 5,
        childrenTechniques: [],
      },
      {
        name: "Clipboard Data",
        ttpIdentifier: "T1115",
        tactic: Tactic.COLLECTION,
        order: 6,
        childrenTechniques: [],
      },
      {
        name: "Data from Cloud Storage Object",
        ttpIdentifier: "T1530",
        tactic: Tactic.COLLECTION,
        order: 7,
        childrenTechniques: [],
      },
      {
        name: "Data from Configuration Repository",
        ttpIdentifier: "T1602",
        tactic: Tactic.COLLECTION,
        order: 8,
        childrenTechniques: [
          {
            name: "SNMP (MIB Dump)",
            ttpIdentifier: "T1602.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "Network Device Configuration Dump",
            ttpIdentifier: "T1602.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
        ],
      },
      {
        name: "Data from Information Repositories",
        ttpIdentifier: "T1213",
        tactic: Tactic.COLLECTION,
        order: 9,
        childrenTechniques: [
          {
            name: "Confluence",
            ttpIdentifier: "T1213.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "SharePoint",
            ttpIdentifier: "T1213.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
          {
            name: "Code Repositories",
            ttpIdentifier: "T1213.003",
            tactic: Tactic.COLLECTION,
            order: 3,
          },
          {
            name: "Customer Relationship Management Software",
            ttpIdentifier: "T1213.004",
            tactic: Tactic.COLLECTION,
            order: 4,
          },
          {
            name: "Messaging Applications",
            ttpIdentifier: "T1213.005",
            tactic: Tactic.COLLECTION,
            order: 5,
          },
        ],
      },
      {
        name: "Data from Local System",
        ttpIdentifier: "T1005",
        tactic: Tactic.COLLECTION,
        order: 10,
        childrenTechniques: [],
      },
      {
        name: "Data from Network Shared Drive",
        ttpIdentifier: "T1039",
        tactic: Tactic.COLLECTION,
        order: 11,
        childrenTechniques: [],
      },
      {
        name: "Data from Removable Media",
        ttpIdentifier: "T1025",
        tactic: Tactic.COLLECTION,
        order: 12,
        childrenTechniques: [],
      },
      {
        name: "Data Staged",
        ttpIdentifier: "T1074",
        tactic: Tactic.COLLECTION,
        order: 13,
        childrenTechniques: [
          {
            name: "Local Data Staging",
            ttpIdentifier: "T1074.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "Remote Data Staging",
            ttpIdentifier: "T1074.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
        ],
      },
      {
        name: "Email Collection",
        ttpIdentifier: "T1114",
        tactic: Tactic.COLLECTION,
        order: 14,
        childrenTechniques: [
          {
            name: "Local Email Collection",
            ttpIdentifier: "T1114.001",
            tactic: Tactic.COLLECTION,
            order: 1,
          },
          {
            name: "Remote Email Collection",
            ttpIdentifier: "T1114.002",
            tactic: Tactic.COLLECTION,
            order: 2,
          },
          {
            name: "Email Forwarding Rule",
            ttpIdentifier: "T1114.003",
            tactic: Tactic.COLLECTION,
            order: 3,
          },
        ],
      },
      // {
      //   name: "Input Capture",
      //   ttpIdentifier: "T1056",
      //   tactic: Tactic.COLLECTION,
      //   order: 15,
      //   childrenTechniques: [
      //     {
      //       name: "Keylogging",
      //       ttpIdentifier: "T1056.001",
      //       tactic: Tactic.COLLECTION,
      //       order: 1,
      //     },
      //     {
      //       name: "GUI Input Capture",
      //       ttpIdentifier: "T1056.002",
      //       tactic: Tactic.COLLECTION,
      //       order: 2,
      //     },
      //     {
      //       name: "Web Portal Capture",
      //       ttpIdentifier: "T1056.003",
      //       tactic: Tactic.COLLECTION,
      //       order: 3,
      //     },
      //     {
      //       name: "Credential API Hooking",
      //       ttpIdentifier: "T1056.004",
      //       tactic: Tactic.COLLECTION,
      //       order: 4,
      //     },
      //   ],
      // },
      {
        name: "Screen Capture",
        ttpIdentifier: "T1113",
        tactic: Tactic.COLLECTION,
        order: 16,
        childrenTechniques: [],
      },
      {
        name: "Video Capture",
        ttpIdentifier: "T1125",
        tactic: Tactic.COLLECTION,
        order: 17,
        childrenTechniques: [],
      },
      {
        name: "Application Layer Protocol",
        ttpIdentifier: "T1071",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 1,
        childrenTechniques: [
          {
            name: "Web Protocols",
            ttpIdentifier: "T1071.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "File Transfer Protocols",
            ttpIdentifier: "T1071.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
          {
            name: "Mail Protocols",
            ttpIdentifier: "T1071.003",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 3,
          },
          {
            name: "DNS",
            ttpIdentifier: "T1071.004",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 4,
          },
          {
            name: "Publish/Subscribe Protocols",
            ttpIdentifier: "T1071.005",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 5,
          },
        ],
      },
      {
        name: "Communication Through Removable Media",
        ttpIdentifier: "T1092",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 2,
        childrenTechniques: [],
      },
      {
        name: "Content Injection",
        ttpIdentifier: "T1659",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Data Encoding",
        ttpIdentifier: "T1132",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 4,
        childrenTechniques: [
          {
            name: "Standard Encoding",
            ttpIdentifier: "T1132.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Non-Standard Encoding",
            ttpIdentifier: "T1132.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
        ],
      },
      {
        name: "Data Obfuscation",
        ttpIdentifier: "T1001",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 5,
        childrenTechniques: [
          {
            name: "Junk Data",
            ttpIdentifier: "T1001.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Steganography",
            ttpIdentifier: "T1001.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
          {
            name: "Protocol Impersonation",
            ttpIdentifier: "T1001.003",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 3,
          },
        ],
      },
      {
        name: "Dynamic Resolution",
        ttpIdentifier: "T1568",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 6,
        childrenTechniques: [
          {
            name: "Fast Flux DNS",
            ttpIdentifier: "T1568.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Domain Generation Algorithms",
            ttpIdentifier: "T1568.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
          {
            name: "DNS Calculation",
            ttpIdentifier: "T1568.003",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 3,
          },
        ],
      },
      {
        name: "Encrypted Channel",
        ttpIdentifier: "T1573",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 7,
        childrenTechniques: [
          {
            name: "Symmetric Cryptography",
            ttpIdentifier: "T1573.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Asymmetric Cryptography",
            ttpIdentifier: "T1573.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
        ],
      },
      {
        name: "Fallback Channels",
        ttpIdentifier: "T1008",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Hide Infrastructure",
        ttpIdentifier: "T1665",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 9,
        childrenTechniques: [],
      },
      {
        name: "Ingress Tool Transfer",
        ttpIdentifier: "T1105",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 10,
        childrenTechniques: [],
      },
      {
        name: "Multi-Stage Channels",
        ttpIdentifier: "T1104",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 11,
        childrenTechniques: [],
      },
      {
        name: "Non-Application Layer Protocol",
        ttpIdentifier: "T1095",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 12,
        childrenTechniques: [],
      },
      {
        name: "Non-Standard Port",
        ttpIdentifier: "T1571",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 13,
        childrenTechniques: [],
      },
      {
        name: "Protocol Tunneling",
        ttpIdentifier: "T1572",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 14,
        childrenTechniques: [],
      },
      {
        name: "Proxy",
        ttpIdentifier: "T1090",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 15,
        childrenTechniques: [
          {
            name: "Internal Proxy",
            ttpIdentifier: "T1090.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "External Proxy",
            ttpIdentifier: "T1090.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
          {
            name: "Multi-hop Proxy",
            ttpIdentifier: "T1090.003",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 3,
          },
          {
            name: "Domain Fronting",
            ttpIdentifier: "T1090.004",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 4,
          },
        ],
      },
      {
        name: "Remote Access Software",
        ttpIdentifier: "T1219",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 16,
        childrenTechniques: [],
      },
      {
        name: "Traffic Signaling",
        ttpIdentifier: "T1205",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 17,
        childrenTechniques: [
          {
            name: "Port Knocking",
            ttpIdentifier: "T1205.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Socket Filters",
            ttpIdentifier: "T1205.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
        ],
      },
      {
        name: "Web Service",
        ttpIdentifier: "T1102",
        tactic: Tactic.COMMAND_AND_CONTROL,
        order: 18,
        childrenTechniques: [
          {
            name: "Dead Drop Resolver",
            ttpIdentifier: "T1102.001",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 1,
          },
          {
            name: "Bidirectional Communication",
            ttpIdentifier: "T1102.002",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 2,
          },
          {
            name: "One-Way Communication",
            ttpIdentifier: "T1102.003",
            tactic: Tactic.COMMAND_AND_CONTROL,
            order: 3,
          },
        ],
      },
      // {
      //   name: "Adversary-in-the-Middle",
      //   ttpIdentifier: "T1557",
      //   tactic: Tactic.CREDENTIAL_ACCESS,
      //   order: 1,
      //   childrenTechniques: [
      //     {
      //       name: "LLMNR/NBT-NS Poisoning and SMB Relay",
      //       ttpIdentifier: "T1557.001",
      //       tactic: Tactic.CREDENTIAL_ACCESS,
      //       order: 1,
      //     },
      //     {
      //       name: "ARP Cache Poisoning",
      //       ttpIdentifier: "T1557.002",
      //       tactic: Tactic.CREDENTIAL_ACCESS,
      //       order: 2,
      //     },
      //     {
      //       name: "DHCP Spoofing",
      //       ttpIdentifier: "T1557.003",
      //       tactic: Tactic.CREDENTIAL_ACCESS,
      //       order: 3,
      //     },
      //     {
      //       name: "Evil Twin",
      //       ttpIdentifier: "T1557.004",
      //       tactic: Tactic.CREDENTIAL_ACCESS,
      //       order: 4,
      //     },
      //   ],
      // },
      {
        name: "Brute Force",
        ttpIdentifier: "T1110",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 2,
        childrenTechniques: [
          {
            name: "Password Guessing",
            ttpIdentifier: "T1110.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Password Cracking",
            ttpIdentifier: "T1110.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Password Spraying",
            ttpIdentifier: "T1110.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "Credential Stuffing",
            ttpIdentifier: "T1110.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
        ],
      },
      {
        name: "Credentials from Password Stores",
        ttpIdentifier: "T1555",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 3,
        childrenTechniques: [
          {
            name: "Keychain",
            ttpIdentifier: "T1555.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Securityd Memory",
            ttpIdentifier: "T1555.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Credentials from Web Browsers",
            ttpIdentifier: "T1555.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "Windows Credential Manager",
            ttpIdentifier: "T1555.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
          {
            name: "Password Managers",
            ttpIdentifier: "T1555.005",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 5,
          },
          {
            name: "Cloud Secrets Management Stores",
            ttpIdentifier: "T1555.006",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 6,
          },
        ],
      },
      {
        name: "Exploitation for Credential Access",
        ttpIdentifier: "T1212",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 4,
        childrenTechniques: [],
      },
      {
        name: "Forced Authentication",
        ttpIdentifier: "T1187",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 5,
        childrenTechniques: [],
      },
      {
        name: "Forge Web Credentials",
        ttpIdentifier: "T1606",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 6,
        childrenTechniques: [
          {
            name: "Web Cookies",
            ttpIdentifier: "T1606.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "SAML Tokens",
            ttpIdentifier: "T1606.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
        ],
      },
      {
        name: "Input Capture",
        ttpIdentifier: "T1056",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 7,
        childrenTechniques: [
          {
            name: "Keylogging",
            ttpIdentifier: "T1056.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "GUI Input Capture",
            ttpIdentifier: "T1056.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Web Portal Capture",
            ttpIdentifier: "T1056.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "Credential API Hooking",
            ttpIdentifier: "T1056.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
        ],
      },
      {
        name: "Modify Authentication Process",
        ttpIdentifier: "T1556",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 8,
        childrenTechniques: [
          {
            name: "Domain Controller Authentication",
            ttpIdentifier: "T1556.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Password Filter DLL",
            ttpIdentifier: "T1556.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Pluggable Authentication Modules",
            ttpIdentifier: "T1556.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "Network Device Authentication",
            ttpIdentifier: "T1556.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
          {
            name: "Reversible Encryption",
            ttpIdentifier: "T1556.005",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 5,
          },
          {
            name: "Multi-Factor Authentication",
            ttpIdentifier: "T1556.006",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 6,
          },
          {
            name: "Hybrid Identity",
            ttpIdentifier: "T1556.007",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 7,
          },
          {
            name: "Network Provider DLL",
            ttpIdentifier: "T1556.008",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 8,
          },
          {
            name: "Conditional Access Policies",
            ttpIdentifier: "T1556.009",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 9,
          },
        ],
      },
      {
        name: "Multi-Factor Authentication Interception",
        ttpIdentifier: "T1111",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 9,
        childrenTechniques: [],
      },
      {
        name: "Multi-Factor Authentication Request Generation",
        ttpIdentifier: "T1621",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 10,
        childrenTechniques: [],
      },
      {
        name: "Network Sniffing",
        ttpIdentifier: "T1040",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 11,
        childrenTechniques: [],
      },
      {
        name: "OS Credential Dumping",
        ttpIdentifier: "T1003",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 12,
        childrenTechniques: [
          {
            name: "LSASS Memory",
            ttpIdentifier: "T1003.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Security Account Manager (SAM)",
            ttpIdentifier: "T1003.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "NTDS",
            ttpIdentifier: "T1003.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "LSA Secrets",
            ttpIdentifier: "T1003.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
          {
            name: "Cached Domain Credentials",
            ttpIdentifier: "T1003.005",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 5,
          },
          {
            name: "DCSync",
            ttpIdentifier: "T1003.006",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 6,
          },
          {
            name: "Proc Filesystem",
            ttpIdentifier: "T1003.007",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 7,
          },
          {
            name: "/etc/passwd and /etc/shadow",
            ttpIdentifier: "T1003.008",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 8,
          },
        ],
      },
      {
        name: "Steal Application Access Token",
        ttpIdentifier: "T1528",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 13,
        childrenTechniques: [],
      },
      {
        name: "Steal or Forge Authentication Certificates",
        ttpIdentifier: "T1649",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 14,
        childrenTechniques: [],
      },
      {
        name: "Steal or Forge Kerberos Tickets",
        ttpIdentifier: "T1558",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 15,
        childrenTechniques: [
          {
            name: "Golden Ticket",
            ttpIdentifier: "T1558.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Silver Ticket",
            ttpIdentifier: "T1558.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Kerberoasting",
            ttpIdentifier: "T1558.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "AS-REP Roasting",
            ttpIdentifier: "T1558.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
          {
            name: "Cache Files",
            ttpIdentifier: "T1558.005",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 5,
          },
        ],
      },
      {
        name: "Steal Web Session Cookie",
        ttpIdentifier: "T1539",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 16,
        childrenTechniques: [],
      },
      {
        name: "Unsecured Credentials",
        ttpIdentifier: "T1552",
        tactic: Tactic.CREDENTIAL_ACCESS,
        order: 17,
        childrenTechniques: [
          {
            name: "Credentials In Files",
            ttpIdentifier: "T1552.001",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 1,
          },
          {
            name: "Credentials in Registry",
            ttpIdentifier: "T1552.002",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 2,
          },
          {
            name: "Bash History",
            ttpIdentifier: "T1552.003",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 3,
          },
          {
            name: "Private Keys",
            ttpIdentifier: "T1552.004",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 4,
          },
          {
            name: "Cloud Instance Metadata API",
            ttpIdentifier: "T1552.005",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 5,
          },
          {
            name: "Group Policy Preferences",
            ttpIdentifier: "T1552.006",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 6,
          },
          {
            name: "Container API",
            ttpIdentifier: "T1552.007",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 7,
          },
          {
            name: "Chat Messages",
            ttpIdentifier: "T1552.008",
            tactic: Tactic.CREDENTIAL_ACCESS,
            order: 8,
          },
        ],
      },
      {
        name: "Account Discovery",
        ttpIdentifier: "T1087",
        tactic: Tactic.DISCOVERY,
        order: 1,
        childrenTechniques: [
          {
            name: "Local Account",
            ttpIdentifier: "T1087.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
          {
            name: "Domain Account",
            ttpIdentifier: "T1087.002",
            tactic: Tactic.DISCOVERY,
            order: 2,
          },
          {
            name: "Email Account",
            ttpIdentifier: "T1087.003",
            tactic: Tactic.DISCOVERY,
            order: 3,
          },
          {
            name: "Cloud Account",
            ttpIdentifier: "T1087.004",
            tactic: Tactic.DISCOVERY,
            order: 4,
          },
        ],
      },
      {
        name: "Application Window Discovery",
        ttpIdentifier: "T1010",
        tactic: Tactic.DISCOVERY,
        order: 2,
        childrenTechniques: [],
      },
      {
        name: "Browser Bookmark Discovery",
        ttpIdentifier: "T1217",
        tactic: Tactic.DISCOVERY,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Cloud Infrastructure Discovery",
        ttpIdentifier: "T1580",
        tactic: Tactic.DISCOVERY,
        order: 4,
        childrenTechniques: [],
      },
      // {
      //   name: "Cloud Service Dashboard",
      //   ttpIdentifier: "T1526",
      //   tactic: Tactic.DISCOVERY,
      //   order: 5,
      //   childrenTechniques: [],
      // },
      {
        name: "Cloud Service Discovery",
        ttpIdentifier: "T1526",
        tactic: Tactic.DISCOVERY,
        order: 6,
        childrenTechniques: [],
      },
      {
        name: "Cloud Storage Object Discovery",
        ttpIdentifier: "T1619",
        tactic: Tactic.DISCOVERY,
        order: 7,
        childrenTechniques: [],
      },
      {
        name: "Container and Resource Discovery",
        ttpIdentifier: "T1613",
        tactic: Tactic.DISCOVERY,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Debugger Evasion",
        ttpIdentifier: "T1622",
        tactic: Tactic.DISCOVERY,
        order: 9,
        childrenTechniques: [],
      },
      {
        name: "Device Driver Discovery",
        ttpIdentifier: "T1652",
        tactic: Tactic.DISCOVERY,
        order: 10,
        childrenTechniques: [],
      },
      {
        name: "Domain Trust Discovery",
        ttpIdentifier: "T1482",
        tactic: Tactic.DISCOVERY,
        order: 11,
        childrenTechniques: [],
      },
      {
        name: "File and Directory Discovery",
        ttpIdentifier: "T1083",
        tactic: Tactic.DISCOVERY,
        order: 12,
        childrenTechniques: [],
      },
      {
        name: "Group Policy Discovery",
        ttpIdentifier: "T1615",
        tactic: Tactic.DISCOVERY,
        order: 13,
        childrenTechniques: [],
      },
      {
        name: "Log Enumeration",
        ttpIdentifier: "T1654",
        tactic: Tactic.DISCOVERY,
        order: 14,
        childrenTechniques: [],
      },
      {
        name: "Network Service Discovery",
        ttpIdentifier: "T1046",
        tactic: Tactic.DISCOVERY,
        order: 15,
        childrenTechniques: [],
      },
      {
        name: "Network Share Discovery",
        ttpIdentifier: "T1135",
        tactic: Tactic.DISCOVERY,
        order: 16,
        childrenTechniques: [],
      },
      // {
      //   name: "Network Sniffing",
      //   ttpIdentifier: "T1040",
      //   tactic: Tactic.DISCOVERY,
      //   order: 17,
      //   childrenTechniques: [],
      // },
      {
        name: "Password Policy Discovery",
        ttpIdentifier: "T1201",
        tactic: Tactic.DISCOVERY,
        order: 18,
        childrenTechniques: [],
      },
      {
        name: "Peripheral Device Discovery",
        ttpIdentifier: "T1120",
        tactic: Tactic.DISCOVERY,
        order: 19,
        childrenTechniques: [],
      },
      {
        name: "Permission Groups Discovery",
        ttpIdentifier: "T1069",
        tactic: Tactic.DISCOVERY,
        order: 20,
        childrenTechniques: [
          {
            name: "Local Groups",
            ttpIdentifier: "T1069.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
          {
            name: "Domain Groups",
            ttpIdentifier: "T1069.002",
            tactic: Tactic.DISCOVERY,
            order: 2,
          },
          {
            name: "Cloud Groups",
            ttpIdentifier: "T1069.003",
            tactic: Tactic.DISCOVERY,
            order: 3,
          },
        ],
      },
      {
        name: "Process Discovery",
        ttpIdentifier: "T1057",
        tactic: Tactic.DISCOVERY,
        order: 21,
        childrenTechniques: [],
      },
      {
        name: "Query Registry",
        ttpIdentifier: "T1012",
        tactic: Tactic.DISCOVERY,
        order: 22,
        childrenTechniques: [],
      },
      {
        name: "Remote System Discovery",
        ttpIdentifier: "T1018",
        tactic: Tactic.DISCOVERY,
        order: 23,
        childrenTechniques: [],
      },
      {
        name: "Software Discovery",
        ttpIdentifier: "T1518",
        tactic: Tactic.DISCOVERY,
        order: 24,
        childrenTechniques: [
          {
            name: "Security Software Discovery",
            ttpIdentifier: "T1518.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
        ],
      },
      {
        name: "System Information Discovery",
        ttpIdentifier: "T1082",
        tactic: Tactic.DISCOVERY,
        order: 25,
        childrenTechniques: [],
      },
      {
        name: "System Location Discovery",
        ttpIdentifier: "T1614",
        tactic: Tactic.DISCOVERY,
        order: 26,
        childrenTechniques: [
          {
            name: "System Language Discovery",
            ttpIdentifier: "T1614.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
        ],
      },
      {
        name: "System Network Configuration Discovery",
        ttpIdentifier: "T1016",
        tactic: Tactic.DISCOVERY,
        order: 27,
        childrenTechniques: [
          {
            name: "Internet Connection Discovery",
            ttpIdentifier: "T1016.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
          {
            name: "Wi-Fi Discovery",
            ttpIdentifier: "T1016.002",
            tactic: Tactic.DISCOVERY,
            order: 2,
          },
        ],
      },
      {
        name: "System Network Connections Discovery",
        ttpIdentifier: "T1049",
        tactic: Tactic.DISCOVERY,
        order: 28,
        childrenTechniques: [],
      },
      {
        name: "System Owner/User Discovery",
        ttpIdentifier: "T1033",
        tactic: Tactic.DISCOVERY,
        order: 29,
        childrenTechniques: [],
      },
      {
        name: "System Service Discovery",
        ttpIdentifier: "T1007",
        tactic: Tactic.DISCOVERY,
        order: 30,
        childrenTechniques: [],
      },
      {
        name: "System Time Discovery",
        ttpIdentifier: "T1124",
        tactic: Tactic.DISCOVERY,
        order: 31,
        childrenTechniques: [],
      },
      {
        name: "Virtualization/Sandbox Evasion",
        ttpIdentifier: "T1497",
        tactic: Tactic.DISCOVERY,
        order: 32,
        childrenTechniques: [
          {
            name: "System Checks",
            ttpIdentifier: "T1497.001",
            tactic: Tactic.DISCOVERY,
            order: 1,
          },
          {
            name: "User Activity Based Checks",
            ttpIdentifier: "T1497.002",
            tactic: Tactic.DISCOVERY,
            order: 2,
          },
          {
            name: "Time Based Evasion",
            ttpIdentifier: "T1497.003",
            tactic: Tactic.DISCOVERY,
            order: 3,
          },
        ],
      },
      {
        name: "Automated Exfiltration",
        ttpIdentifier: "T1020",
        tactic: Tactic.EXFILTRATION,
        order: 1,
        childrenTechniques: [
          {
            name: "Traffic Duplication",
            ttpIdentifier: "T1020.001",
            tactic: Tactic.EXFILTRATION,
            order: 1,
          },
        ],
      },
      {
        name: "Data Transfer Size Limits",
        ttpIdentifier: "T1030",
        tactic: Tactic.EXFILTRATION,
        order: 2,
        childrenTechniques: [],
      },
      {
        name: "Exfiltration Over Alternative Protocol",
        ttpIdentifier: "T1048",
        tactic: Tactic.EXFILTRATION,
        order: 3,
        childrenTechniques: [
          {
            name: "Exfiltration Over Symmetric Encrypted Non-C2 Protocol",
            ttpIdentifier: "T1048.001",
            tactic: Tactic.EXFILTRATION,
            order: 1,
          },
          {
            name: "Exfiltration Over Asymmetric Encrypted Non-C2 Protocol",
            ttpIdentifier: "T1048.002",
            tactic: Tactic.EXFILTRATION,
            order: 2,
          },
          {
            name: "Exfiltration Over Unencrypted Non-C2 Protocol",
            ttpIdentifier: "T1048.003",
            tactic: Tactic.EXFILTRATION,
            order: 3,
          },
        ],
      },
      {
        name: "Exfiltration Over C2 Channel",
        ttpIdentifier: "T1041",
        tactic: Tactic.EXFILTRATION,
        order: 4,
        childrenTechniques: [],
      },
      {
        name: "Exfiltration Over Other Network Medium",
        ttpIdentifier: "T1011",
        tactic: Tactic.EXFILTRATION,
        order: 5,
        childrenTechniques: [
          {
            name: "Exfiltration Over Bluetooth",
            ttpIdentifier: "T1011.001",
            tactic: Tactic.EXFILTRATION,
            order: 1,
          },
        ],
      },
      {
        name: "Exfiltration Over Physical Medium",
        ttpIdentifier: "T1052",
        tactic: Tactic.EXFILTRATION,
        order: 6,
        childrenTechniques: [
          {
            name: "Exfiltration Over USB",
            ttpIdentifier: "T1052.001",
            tactic: Tactic.EXFILTRATION,
            order: 1,
          },
        ],
      },
      {
        name: "Exfiltration Over Web Service",
        ttpIdentifier: "T1567",
        tactic: Tactic.EXFILTRATION,
        order: 7,
        childrenTechniques: [
          {
            name: "Exfiltration to Code Repository",
            ttpIdentifier: "T1567.001",
            tactic: Tactic.EXFILTRATION,
            order: 1,
          },
          {
            name: "Exfiltration to Cloud Storage",
            ttpIdentifier: "T1567.002",
            tactic: Tactic.EXFILTRATION,
            order: 2,
          },
          {
            name: "Exfiltration to Text Storage Sites",
            ttpIdentifier: "T1567.003",
            tactic: Tactic.EXFILTRATION,
            order: 3,
          },
          {
            name: "Exfiltration Over Webhook",
            ttpIdentifier: "T1567.004",
            tactic: Tactic.EXFILTRATION,
            order: 4,
          },
        ],
      },
      {
        name: "Scheduled Transfer",
        ttpIdentifier: "T1029",
        tactic: Tactic.EXFILTRATION,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Transfer Data to Cloud Account",
        ttpIdentifier: "T1537",
        tactic: Tactic.EXFILTRATION,
        order: 9,
        childrenTechniques: [],
      },
      {
        name: "Account Access Removal",
        ttpIdentifier: "T1531",
        tactic: Tactic.IMPACT,
        order: 1,
        childrenTechniques: [],
      },
      {
        name: "Data Destruction",
        ttpIdentifier: "T1485",
        tactic: Tactic.IMPACT,
        order: 2,
        childrenTechniques: [
          {
            name: "Lifecycle-Triggered Deletion",
            ttpIdentifier: "T1485.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
        ],
      },
      {
        name: "Data Encrypted for Impact",
        ttpIdentifier: "T1486",
        tactic: Tactic.IMPACT,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Data Manipulation",
        ttpIdentifier: "T1565",
        tactic: Tactic.IMPACT,
        order: 4,
        childrenTechniques: [
          {
            name: "Stored Data Manipulation",
            ttpIdentifier: "T1565.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "Transmitted Data Manipulation",
            ttpIdentifier: "T1565.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
          {
            name: "Runtime Data Manipulation",
            ttpIdentifier: "T1565.003",
            tactic: Tactic.IMPACT,
            order: 3,
          },
        ],
      },
      {
        name: "Defacement",
        ttpIdentifier: "T1491",
        tactic: Tactic.IMPACT,
        order: 5,
        childrenTechniques: [
          {
            name: "Internal Defacement",
            ttpIdentifier: "T1491.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "External Defacement",
            ttpIdentifier: "T1491.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
        ],
      },
      {
        name: "Disk Wipe",
        ttpIdentifier: "T1561",
        tactic: Tactic.IMPACT,
        order: 6,
        childrenTechniques: [
          {
            name: "Disk Content Wipe",
            ttpIdentifier: "T1561.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "Disk Structure Wipe",
            ttpIdentifier: "T1561.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
        ],
      },
      {
        name: "Endpoint Denial of Service",
        ttpIdentifier: "T1499",
        tactic: Tactic.IMPACT,
        order: 7,
        childrenTechniques: [
          {
            name: "OS Exhaustion Flood",
            ttpIdentifier: "T1499.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "Service Exhaustion Flood",
            ttpIdentifier: "T1499.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
          {
            name: "Application Exhaustion Flood",
            ttpIdentifier: "T1499.003",
            tactic: Tactic.IMPACT,
            order: 3,
          },
          {
            name: "Application or System Exploitation",
            ttpIdentifier: "T1499.004",
            tactic: Tactic.IMPACT,
            order: 4,
          },
        ],
      },
      {
        name: "Financial Theft",
        ttpIdentifier: "T1657",
        tactic: Tactic.IMPACT,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Firmware Corruption",
        ttpIdentifier: "T1495",
        tactic: Tactic.IMPACT,
        order: 9,
        childrenTechniques: [],
      },
      {
        name: "Inhibit System Recovery",
        ttpIdentifier: "T1490",
        tactic: Tactic.IMPACT,
        order: 10,
        childrenTechniques: [],
      },
      {
        name: "Network Denial of Service",
        ttpIdentifier: "T1498",
        tactic: Tactic.IMPACT,
        order: 11,
        childrenTechniques: [
          {
            name: "Direct Network Flood",
            ttpIdentifier: "T1498.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "Reflection Amplification",
            ttpIdentifier: "T1498.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
        ],
      },
      {
        name: "Resource Hijacking",
        ttpIdentifier: "T1496",
        tactic: Tactic.IMPACT,
        order: 12,
        childrenTechniques: [
          {
            name: "Compute Hijacking",
            ttpIdentifier: "T1496.001",
            tactic: Tactic.IMPACT,
            order: 1,
          },
          {
            name: "Bandwidth Hijacking",
            ttpIdentifier: "T1496.002",
            tactic: Tactic.IMPACT,
            order: 2,
          },
          {
            name: "SMS Pumping",
            ttpIdentifier: "T1496.003",
            tactic: Tactic.IMPACT,
            order: 3,
          },
          {
            name: "Cloud Service Hijacking",
            ttpIdentifier: "T1496.004",
            tactic: Tactic.IMPACT,
            order: 4,
          },
        ],
      },
      {
        name: "Service Stop",
        ttpIdentifier: "T1489",
        tactic: Tactic.IMPACT,
        order: 13,
        childrenTechniques: [],
      },
      {
        name: "System Shutdown/Reboot",
        ttpIdentifier: "T1529",
        tactic: Tactic.IMPACT,
        order: 14,
        childrenTechniques: [],
      },
      {
        name: "Exploitation of Remote Services",
        ttpIdentifier: "T1210",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 1,
        childrenTechniques: [],
      },
      {
        name: "Internal Spearphishing",
        ttpIdentifier: "T1534",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 2,
        childrenTechniques: [],
      },
      {
        name: "Lateral Tool Transfer",
        ttpIdentifier: "T1570",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 3,
        childrenTechniques: [],
      },
      {
        name: "Remote Services Session Hijacking",
        ttpIdentifier: "T1563",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 4,
        childrenTechniques: [
          {
            name: "SSH Hijacking",
            ttpIdentifier: "T1563.001",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 1,
          },
          {
            name: "RDP Hijacking",
            ttpIdentifier: "T1563.002",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 2,
          },
        ],
      },
      {
        name: "Remote Services",
        ttpIdentifier: "T1021",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 5,
        childrenTechniques: [
          {
            name: "Remote Desktop Protocol",
            ttpIdentifier: "T1021.001",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 1,
          },
          {
            name: "SMB/Windows Admin Shares",
            ttpIdentifier: "T1021.002",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 2,
          },
          {
            name: "Distributed Component Object Model (DCOM)",
            ttpIdentifier: "T1021.003",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 3,
          },
          {
            name: "SSH",
            ttpIdentifier: "T1021.004",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 4,
          },
          {
            name: "VNC",
            ttpIdentifier: "T1021.005",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 5,
          },
          {
            name: "Windows Remote Management",
            ttpIdentifier: "T1021.006",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 6,
          },
          {
            name: "Cloud Services",
            ttpIdentifier: "T1021.007",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 7,
          },
          {
            name: "Direct Cloud VM Connections",
            ttpIdentifier: "T1021.008",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 8,
          },
        ],
      },
      {
        name: "Replication Through Removable Media",
        ttpIdentifier: "T1091",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 6,
        childrenTechniques: [],
      },
      {
        name: "Software Deployment Tools",
        ttpIdentifier: "T1072",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 7,
        childrenTechniques: [],
      },
      {
        name: "Taint Shared Content",
        ttpIdentifier: "T1080",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 8,
        childrenTechniques: [],
      },
      {
        name: "Use Alternate Authentication Material",
        ttpIdentifier: "T1550",
        tactic: Tactic.LATERAL_MOVEMENT,
        order: 9,
        childrenTechniques: [
          {
            name: "Application Access Token",
            ttpIdentifier: "T1550.001",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 1,
          },
          {
            name: "Pass the Hash",
            ttpIdentifier: "T1550.002",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 2,
          },
          {
            name: "Pass the Ticket",
            ttpIdentifier: "T1550.003",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 3,
          },
          {
            name: "Web Session Cookie",
            ttpIdentifier: "T1550.004",
            tactic: Tactic.LATERAL_MOVEMENT,
            order: 4,
          },
        ],
      },
    ];

    for (const technique of techniques) {
      try {
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
      } catch (error) {
        console.error(technique.ttpIdentifier);
      }
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
