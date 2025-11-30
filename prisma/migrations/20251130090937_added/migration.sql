-- CreateTable
CREATE TABLE "Trainer" (
    "id" SERIAL NOT NULL,
    "isWorking" BOOLEAN NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "certifications" TEXT,
    "bio" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" SERIAL NOT NULL,
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "isWeekly" BOOLEAN NOT NULL,
    "trainerId" INTEGER NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PTSession" (
    "id" SERIAL NOT NULL,
    "goal_completed" BOOLEAN NOT NULL,
    "memberId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "timeSlotId" INTEGER NOT NULL,

    CONSTRAINT "PTSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userId_key" ON "Trainer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_trainerId_key" ON "TimeSlot"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSession_memberId_key" ON "PTSession"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSession_trainerId_key" ON "PTSession"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "PTSession_timeSlotId_key" ON "PTSession"("timeSlotId");

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSession" ADD CONSTRAINT "PTSession_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSession" ADD CONSTRAINT "PTSession_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PTSession" ADD CONSTRAINT "PTSession_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
