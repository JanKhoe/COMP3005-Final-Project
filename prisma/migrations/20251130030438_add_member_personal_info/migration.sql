/*
  Warnings:

  - Added the required column `allergies` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalConditions` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "allergies" TEXT NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "medicalConditions" TEXT NOT NULL;
