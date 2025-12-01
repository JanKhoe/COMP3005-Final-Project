import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export interface TrainerWorkData {
  trainer_id: number;
  class_offering_id: number | null;
  className: string | null;
  description: string | null;
  scheduleTime: Date | null;
  durationMins: number | null;
  pt_session_id: number | null;
  goal_completed: boolean | null;
  memberId: number | null;
  group_class_id: number | null;
  capacityCount: number | null;
  attendeesCount: number | null;
}

// GET all students
export async function getTrainerWork(trainerId: number): Promise<TrainerWorkData[]> {
  const result = await pool.query(
    'SELECT * FROM trainer_work_data WHERE trainer_id = $1',
    [trainerId]
  );
  return result.rows;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const trainerId = parseInt(params.id);
  const work = await getTrainerWork(trainerId);
  return NextResponse.json(work);
}
