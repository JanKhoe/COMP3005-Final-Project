/*
  Warnings:

  - You are about to drop the `PTSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PTSession" DROP CONSTRAINT "PTSession_memberId_fkey";

-- DropForeignKey
ALTER TABLE "PTSession" DROP CONSTRAINT "PTSession_timeSlotId_fkey";

-- DropForeignKey
ALTER TABLE "PTSession" DROP CONSTRAINT "PTSession_trainerId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_trainerId_fkey";

-- DropTable
DROP TABLE "PTSession";

-- DropTable
DROP TABLE "TimeSlot";

-- CreateTable
CREATE TABLE "ClassOffering" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "ClassOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PTSessionOffering" (
    "id" SERIAL NOT NULL,
    "goal_completed" BOOLEAN NOT NULL,
    "memberId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "classOfferingId" INTEGER NOT NULL,

    CONSTRAINT "PTSessionOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupClassOffering" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "GroupClassOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "id" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassOffering_id_idx" ON "ClassOffering"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PTSessionOffering_memberId_key" ON "PTSessionOffering"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSessionOffering_trainerId_key" ON "PTSessionOffering"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSessionOffering_classOfferingId_key" ON "PTSessionOffering"("classOfferingId");

-- CreateIndex
CREATE INDEX "PTSessionOffering_id_idx" ON "PTSessionOffering"("id");

-- CreateIndex
CREATE INDEX "GroupClassOffering_id_idx" ON "GroupClassOffering"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_roomNumber_key" ON "Rooms"("roomNumber");

-- AddForeignKey
ALTER TABLE "PTSessionOffering" ADD CONSTRAINT "PTSessionOffering_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSessionOffering" ADD CONSTRAINT "PTSessionOffering_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSessionOffering" ADD CONSTRAINT "PTSessionOffering_classOfferingId_fkey" FOREIGN KEY ("classOfferingId") REFERENCES "ClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupClassOffering" ADD CONSTRAINT "GroupClassOffering_id_fkey" FOREIGN KEY ("id") REFERENCES "ClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
