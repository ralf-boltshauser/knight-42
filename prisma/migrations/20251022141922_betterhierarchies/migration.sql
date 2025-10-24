/*
  Warnings:

  - You are about to drop the `ServiceDependency` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rootGroupId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rootGroupId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceDependency" DROP CONSTRAINT "ServiceDependency_componentId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceDependency" DROP CONSTRAINT "ServiceDependency_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "rootGroupId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ServiceDependency";

-- CreateTable
CREATE TABLE "DependencyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "operator" "DependencyOperator" NOT NULL DEFAULT 'AND',
    "parentGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DependencyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DependencyItem" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dependencyGroupId" TEXT NOT NULL,

    CONSTRAINT "DependencyItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_rootGroupId_key" ON "Service"("rootGroupId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_rootGroupId_fkey" FOREIGN KEY ("rootGroupId") REFERENCES "DependencyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DependencyGroup" ADD CONSTRAINT "DependencyGroup_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "DependencyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DependencyItem" ADD CONSTRAINT "DependencyItem_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DependencyItem" ADD CONSTRAINT "DependencyItem_dependencyGroupId_fkey" FOREIGN KEY ("dependencyGroupId") REFERENCES "DependencyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
