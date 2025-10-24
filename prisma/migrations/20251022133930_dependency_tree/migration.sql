-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('WINDOWS_WORKSTATION', 'WINDOWS_SERVER', 'LINUX_WORKSTATION', 'LINUX_SERVER', 'SERVER', 'CONTAINER', 'FIREWALL', 'ROUTER', 'DNS');

-- CreateEnum
CREATE TYPE "AssetCriticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AssetVisibility" AS ENUM ('NONE', 'ALERTS', 'FULL');

-- CreateEnum
CREATE TYPE "NetworkColor" AS ENUM ('RED', 'GREEN', 'BLUE', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN', 'GRAY');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('ALERT', 'INCIDENT', 'HARMLESS');

-- CreateEnum
CREATE TYPE "DetectionSource" AS ENUM ('VELOCIRAPTOR', 'WAZUH', 'NATO', 'OTHER');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('BACKLOG', 'INITIAL_INVESTIGATION', 'ESCALATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'HAD_CHANGES', 'REPORTED_NATIONAL', 'REPORTED_INTERNATIONAL');

-- CreateEnum
CREATE TYPE "IOCType" AS ENUM ('MD5', 'SHA1', 'SHA256', 'FILENAME', 'PDB', 'FILENAME_MD5', 'FILENAME_SHA1', 'FILENAME_SHA256', 'IP_SRC', 'IP_DST', 'HOSTNAME', 'DOMAIN', 'DOMAIN_IP', 'EMAIL', 'EMAIL_SRC', 'EPPN', 'EMAIL_DST', 'EMAIL_SUBJECT', 'EMAIL_ATTACHMENT', 'EMAIL_BODY', 'FLOAT', 'GIT_COMMIT_ID', 'URL', 'HTTP_METHOD', 'USER_AGENT', 'JA3_FINGERPRINT_MD5', 'JARM_FINGERPRINT', 'FAVICON_MMH3', 'HASSH_MD5', 'HASSH_SERVER_MD5', 'REG_KEY', 'REG_KEY_VALUE', 'AS', 'SNORT', 'BRO', 'ZEEK', 'COMMUNITY_ID', 'PATTERN_IN_FILE', 'PATTERN_IN_TRAFFIC', 'PATTERN_IN_MEMORY', 'PATTERN_FILENAME', 'PGP_PUBLIC_KEY', 'PGP_PRIVATE_KEY', 'YARA', 'STIX2_PATTERN', 'SIGMA', 'GENE', 'KUSTO_QUERY', 'MIME_TYPE', 'IDENTITY_CARD_NUMBER', 'COOKIE', 'VULNERABILITY', 'CPE', 'WEAKNESS', 'ATTACHMENT', 'MALWARE_SAMPLE', 'LINK', 'COMMENT', 'TEXT', 'HEX', 'OTHER', 'NAMED_PIPE', 'MUTEX', 'PROCESS_STATE', 'TARGET_USER', 'TARGET_EMAIL', 'TARGET_MACHINE', 'TARGET_ORG', 'TARGET_LOCATION', 'TARGET_EXTERNAL', 'BTC', 'DASH', 'XMR', 'IBAN', 'BIC', 'BANK_ACCOUNT_NR', 'ABA_RTN', 'BIN', 'CC_NUMBER', 'PRTN', 'PHONE_NUMBER', 'THREAT_ACTOR', 'CAMPAIGN_NAME', 'CAMPAIGN_ID', 'MALWARE_TYPE', 'URI', 'AUTHENTIHASH', 'VHASH', 'SSDEEP', 'IMPHASH', 'TELFHASH', 'PEHASH', 'IMPFUZZY', 'SHA224', 'SHA384', 'SHA512', 'SHA512_224', 'SHA512_256', 'SHA3_224', 'SHA3_256', 'SHA3_384', 'SHA3_512', 'TLSH', 'CDHASH', 'FILENAME_AUTHENTIHASH', 'FILENAME_VHASH', 'FILENAME_SSDEEP', 'FILENAME_IMPHASH', 'FILENAME_IMPFUZZY', 'FILENAME_PEHASH', 'FILENAME_SHA224', 'FILENAME_SHA384', 'FILENAME_SHA512', 'FILENAME_SHA512_224', 'FILENAME_SHA512_256', 'FILENAME_SHA3_224', 'FILENAME_SHA3_256', 'FILENAME_SHA3_384', 'FILENAME_SHA3_512', 'FILENAME_TLSH', 'WINDOWS_SCHEDULED_TASK', 'WINDOWS_SERVICE_NAME', 'WINDOWS_SERVICE_DISPLAYNAME', 'WHOIS_REGISTRANT_EMAIL', 'WHOIS_REGISTRANT_PHONE', 'WHOIS_REGISTRANT_NAME', 'WHOIS_REGISTRANT_ORG', 'WHOIS_REGISTRAR', 'WHOIS_CREATION_DATE', 'X509_FINGERPRINT_SHA1', 'X509_FINGERPRINT_MD5', 'X509_FINGERPRINT_SHA256', 'DNS_SOA_EMAIL', 'SIZE_IN_BYTES', 'COUNTER', 'DATETIME', 'PORT', 'IP_DST_PORT', 'IP_SRC_PORT', 'HOSTNAME_PORT', 'MAC_ADDRESS', 'MAC_EUI_64', 'EMAIL_DST_DISPLAY_NAME', 'EMAIL_SRC_DISPLAY_NAME', 'EMAIL_HEADER', 'EMAIL_REPLY_TO', 'EMAIL_X_MAILER', 'EMAIL_MIME_BOUNDARY', 'EMAIL_THREAD_INDEX', 'EMAIL_MESSAGE_ID', 'GITHUB_USERNAME', 'GITHUB_REPOSITORY', 'GITHUB_ORGANISATION', 'JABBER_ID', 'TWITTER_ID', 'DKIM', 'FIRST_NAME', 'MIDDLE_NAME', 'LAST_NAME', 'FULL_NAME', 'DATE_OF_BIRTH', 'PLACE_OF_BIRTH', 'GENDER', 'PASSPORT_NUMBER', 'PASSPORT_COUNTRY', 'PASSPORT_EXPIRATION', 'REDRESS_NUMBER', 'NATIONALITY', 'VISA_NUMBER', 'ISSUE_DATE_OF_THE_VISA', 'PRIMARY_RESIDENCE', 'COUNTRY_OF_RESIDENCE', 'SPECIAL_SERVICE_REQUEST', 'FREQUENT_FLYER_NUMBER', 'TRAVEL_DETAILS', 'PAYMENT_DETAILS', 'PLACE_PORT_OF_ORIGINAL_EMBARKATION', 'PLACE_PORT_OF_CLEARANCE', 'PLACE_PORT_OF_ONWARD_FOREIGN_DESTINATION', 'PASSENGER_NAME_RECORD_LOCATOR_NUMBER', 'MOBILE_APPLICATION_ID', 'CHROME_EXTENSION_ID', 'CORTEX', 'BOOLEAN', 'ANONYMISED');

-- CreateEnum
CREATE TYPE "Tactic" AS ENUM ('RECONNAISSANCE', 'RESOURCE_DEVELOPMENT', 'INITIAL_ACCESS', 'EXECUTION', 'PERSISTENCE', 'PRIVILEGE_ESCALATION', 'DEFENSE_EVASION', 'CREDENTIAL_ACCESS', 'DISCOVERY', 'LATERAL_MOVEMENT', 'COLLECTION', 'COMMAND_AND_CONTROL', 'EXFILTRATION', 'IMPACT');

-- CreateEnum
CREATE TYPE "ResponseActionType" AS ENUM ('BLOCK', 'MONITORING', 'OTHER');

-- CreateEnum
CREATE TYPE "ResponseActionStatus" AS ENUM ('OUTSTANDING', 'APPROVED', 'PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('OKAY', 'WARNING', 'COMPROMISED', 'DOWN');

-- CreateEnum
CREATE TYPE "EventAction" AS ENUM ('INVESTIGATION', 'KNOWLEDGE', 'ACTION', 'REPORTING');

-- CreateEnum
CREATE TYPE "DependencyOperator" AS ENUM ('AND', 'OR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "resetToken" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ipRange" TEXT NOT NULL,
    "fieldFrom" TEXT NOT NULL,
    "fieldTo" TEXT NOT NULL,
    "fieldLegend" TEXT NOT NULL,
    "networkColor" "NetworkColor" NOT NULL DEFAULT 'GRAY',
    "parentNetworkId" TEXT,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "visibility" "AssetVisibility" NOT NULL DEFAULT 'NONE',
    "metadata" JSONB,
    "criticality" "AssetCriticality" NOT NULL DEFAULT 'LOW',
    "type" "AssetType" NOT NULL DEFAULT 'WINDOWS_WORKSTATION',
    "networkId" TEXT,
    "assignedTeamMemberId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AlertCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '<h3><strong>Observation</strong></h3><ul><li></li></ul><h3><strong>Assumptions</strong></h3><ul><li></li></ul><h3><strong>Next Steps</strong></h3><ul><li></li></ul><h3><strong>Potential Consequences</strong></h3><ul><li></li></ul><p></p>',
    "type" "AlertType" NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDateTime" TIMESTAMP(3),
    "mispEntryLink" TEXT,
    "mispEventId" TEXT,
    "detectionSource" "DetectionSource" NOT NULL,
    "reportStatus" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "lastReportAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "techniqueId" TEXT,
    "status" "AlertStatus" NOT NULL DEFAULT 'BACKLOG',
    "attackChainId" TEXT,
    "assignedInvestigatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetUptime" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "up" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetUptime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IOC" (
    "id" TEXT NOT NULL,
    "type" "IOCType" NOT NULL,
    "value" TEXT NOT NULL,
    "dateFirstObserved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "linkedToMisp" BOOLEAN NOT NULL DEFAULT false,
    "threatActorId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackChain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relatedThreatActorId" TEXT,
    "analystId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttackChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatActor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreatActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ttpIdentifier" TEXT NOT NULL,
    "tactic" "Tactic"[],
    "parentTechniqueId" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actionType" "ResponseActionType" NOT NULL,
    "status" "ResponseActionStatus" NOT NULL DEFAULT 'OUTSTANDING',
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "relatedIncidentId" TEXT,
    "affectedAssetId" TEXT,
    "relatedIOCId" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "assignedTeamMemberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "EventStatus",
    "action" "EventAction",
    "alertId" TEXT,
    "assetId" TEXT,
    "iocId" TEXT,
    "responseActionId" TEXT,
    "responsibleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT,
    "missionCritical" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDependency" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "operator" "DependencyOperator" NOT NULL DEFAULT 'AND',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentHosting" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComponentHosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssetAlerts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssetAlerts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AlertIOCs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlertIOCs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ThreatActorTechniques" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ThreatActorTechniques_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_identifier_key" ON "Asset"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "AlertCategory_name_key" ON "AlertCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Technique_ttpIdentifier_key" ON "Technique"("ttpIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceDependency_serviceId_componentId_key" ON "ServiceDependency"("serviceId", "componentId");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentHosting_componentId_assetId_key" ON "ComponentHosting"("componentId", "assetId");

-- CreateIndex
CREATE INDEX "_AssetAlerts_B_index" ON "_AssetAlerts"("B");

-- CreateIndex
CREATE INDEX "_AlertIOCs_B_index" ON "_AlertIOCs"("B");

-- CreateIndex
CREATE INDEX "_ThreatActorTechniques_B_index" ON "_ThreatActorTechniques"("B");

-- AddForeignKey
ALTER TABLE "Network" ADD CONSTRAINT "Network_parentNetworkId_fkey" FOREIGN KEY ("parentNetworkId") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_assignedTeamMemberId_fkey" FOREIGN KEY ("assignedTeamMemberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AlertCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_attackChainId_fkey" FOREIGN KEY ("attackChainId") REFERENCES "AttackChain"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_assignedInvestigatorId_fkey" FOREIGN KEY ("assignedInvestigatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetUptime" ADD CONSTRAINT "AssetUptime_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IOC" ADD CONSTRAINT "IOC_threatActorId_fkey" FOREIGN KEY ("threatActorId") REFERENCES "ThreatActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackChain" ADD CONSTRAINT "AttackChain_relatedThreatActorId_fkey" FOREIGN KEY ("relatedThreatActorId") REFERENCES "ThreatActor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackChain" ADD CONSTRAINT "AttackChain_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technique" ADD CONSTRAINT "Technique_parentTechniqueId_fkey" FOREIGN KEY ("parentTechniqueId") REFERENCES "Technique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAction" ADD CONSTRAINT "ResponseAction_relatedIncidentId_fkey" FOREIGN KEY ("relatedIncidentId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAction" ADD CONSTRAINT "ResponseAction_affectedAssetId_fkey" FOREIGN KEY ("affectedAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAction" ADD CONSTRAINT "ResponseAction_relatedIOCId_fkey" FOREIGN KEY ("relatedIOCId") REFERENCES "IOC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAction" ADD CONSTRAINT "ResponseAction_assignedTeamMemberId_fkey" FOREIGN KEY ("assignedTeamMemberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_responseActionId_fkey" FOREIGN KEY ("responseActionId") REFERENCES "ResponseAction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDependency" ADD CONSTRAINT "ServiceDependency_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDependency" ADD CONSTRAINT "ServiceDependency_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentHosting" ADD CONSTRAINT "ComponentHosting_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentHosting" ADD CONSTRAINT "ComponentHosting_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetAlerts" ADD CONSTRAINT "_AssetAlerts_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssetAlerts" ADD CONSTRAINT "_AssetAlerts_B_fkey" FOREIGN KEY ("B") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertIOCs" ADD CONSTRAINT "_AlertIOCs_A_fkey" FOREIGN KEY ("A") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlertIOCs" ADD CONSTRAINT "_AlertIOCs_B_fkey" FOREIGN KEY ("B") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThreatActorTechniques" ADD CONSTRAINT "_ThreatActorTechniques_A_fkey" FOREIGN KEY ("A") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThreatActorTechniques" ADD CONSTRAINT "_ThreatActorTechniques_B_fkey" FOREIGN KEY ("B") REFERENCES "ThreatActor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
