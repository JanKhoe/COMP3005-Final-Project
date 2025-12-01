/*
  Warnings:

  - You are about to drop the column `attendeesCount` on the `GroupClassOffering` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classOfferingId]` on the table `GroupClassOffering` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classType` to the `ClassOffering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classOfferingId` to the `GroupClassOffering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal` to the `PTSessionOffering` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('group', 'personal_training');

-- DropForeignKey
ALTER TABLE "GroupClassOffering" DROP CONSTRAINT "GroupClassOffering_id_fkey";

-- AlterTable
ALTER TABLE "ClassOffering" ADD COLUMN     "classType" "ClassType" NOT NULL;

-- AlterTable
ALTER TABLE "GroupClassOffering" DROP COLUMN "attendeesCount",
ADD COLUMN     "classOfferingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PTSessionOffering" ADD COLUMN     "goal" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GroupClassOffering_classOfferingId_key" ON "GroupClassOffering"("classOfferingId");

-- AddForeignKey
ALTER TABLE "GroupClassOffering" ADD CONSTRAINT "GroupClassOffering_classOfferingId_fkey" FOREIGN KEY ("classOfferingId") REFERENCES "ClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
