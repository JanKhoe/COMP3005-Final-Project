-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('member', 'trainer', 'system_admin');

-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('heartbeat', 'calories', 'steps');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "typeOfUser" "UserType" NOT NULL DEFAULT 'member',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "allergies" TEXT NOT NULL,
    "medicalConditions" TEXT NOT NULL,
    "heartbeatGoal" DOUBLE PRECISION,
    "caloriesGoal" DOUBLE PRECISION,
    "stepsGoal" DOUBLE PRECISION,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isWorking" BOOLEAN NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "certifications" TEXT,
    "bio" TEXT,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthMetric" (
    "id" SERIAL NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "HealthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassOffering" (
    "id" SERIAL NOT NULL,
    "className" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "ClassOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PTSessionOffering" (
    "id" SERIAL NOT NULL,
    "goal_completed" BOOLEAN NOT NULL,
    "memberId" INTEGER NOT NULL,
    "classOfferingId" INTEGER NOT NULL,

    CONSTRAINT "PTSessionOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupClassOffering" (
    "id" SERIAL NOT NULL,
    "attendeesCount" INTEGER NOT NULL,

    CONSTRAINT "GroupClassOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MembersInGroupClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MembersInGroupClasses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "Trainer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE INDEX "HealthMetric_memberId_idx" ON "HealthMetric"("memberId");

-- CreateIndex
CREATE INDEX "HealthMetric_measuredAt_idx" ON "HealthMetric"("measuredAt");

-- CreateIndex
CREATE INDEX "ClassOffering_id_idx" ON "ClassOffering"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PTSessionOffering_memberId_key" ON "PTSessionOffering"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSessionOffering_classOfferingId_key" ON "PTSessionOffering"("classOfferingId");

-- CreateIndex
CREATE INDEX "PTSessionOffering_id_idx" ON "PTSessionOffering"("id");

-- CreateIndex
CREATE INDEX "GroupClassOffering_id_idx" ON "GroupClassOffering"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- CreateIndex
CREATE INDEX "_MembersInGroupClasses_B_index" ON "_MembersInGroupClasses"("B");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSessionOffering" ADD CONSTRAINT "PTSessionOffering_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSessionOffering" ADD CONSTRAINT "PTSessionOffering_classOfferingId_fkey" FOREIGN KEY ("classOfferingId") REFERENCES "ClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupClassOffering" ADD CONSTRAINT "GroupClassOffering_id_fkey" FOREIGN KEY ("id") REFERENCES "ClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersInGroupClasses" ADD CONSTRAINT "_MembersInGroupClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersInGroupClasses" ADD CONSTRAINT "_MembersInGroupClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
