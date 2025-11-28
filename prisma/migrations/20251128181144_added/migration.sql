/*
  Warnings:

  - You are about to drop the column `typeOfUser` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('heartbeat', 'calories', 'steps');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "typeOfUser";

-- CreateTable
CREATE TABLE "HealthMetric" (
    "id" SERIAL NOT NULL,
    "metricType" "MetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "HealthMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HealthMetric_memberId_idx" ON "HealthMetric"("memberId");

-- CreateIndex
CREATE INDEX "HealthMetric_measuredAt_idx" ON "HealthMetric"("measuredAt");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- AddForeignKey
ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
