/*
  Warnings:

  - You are about to drop the column `trainerId` on the `PTSessionOffering` table. All the data in the column will be lost.
  - You are about to drop the `Rooms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `ClassOffering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainerId` to the `ClassOffering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendeesCount` to the `GroupClassOffering` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PTSessionOffering" DROP CONSTRAINT "PTSessionOffering_trainerId_fkey";

-- DropIndex
DROP INDEX "PTSessionOffering_trainerId_key";

-- AlterTable
ALTER TABLE "ClassOffering" ADD COLUMN     "roomId" INTEGER NOT NULL,
ADD COLUMN     "trainerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroupClassOffering" ADD COLUMN     "attendeesCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PTSessionOffering" DROP COLUMN "trainerId";

-- DropTable
DROP TABLE "Rooms";

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- CreateIndex
CREATE INDEX "_MembersInGroupClasses_B_index" ON "_MembersInGroupClasses"("B");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassOffering" ADD CONSTRAINT "ClassOffering_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersInGroupClasses" ADD CONSTRAINT "_MembersInGroupClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupClassOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembersInGroupClasses" ADD CONSTRAINT "_MembersInGroupClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
