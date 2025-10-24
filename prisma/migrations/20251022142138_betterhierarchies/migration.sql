-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_rootGroupId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "rootGroupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_rootGroupId_fkey" FOREIGN KEY ("rootGroupId") REFERENCES "DependencyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
