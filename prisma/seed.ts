import { PrismaClient } from "@prisma/client";

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
