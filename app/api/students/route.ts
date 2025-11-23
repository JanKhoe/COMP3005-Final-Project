import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all students
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY student_id');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

// CREATE a new student
export async function POST(request: Request) {
  try {
    const { first_name, last_name, email, enrollment_date } = await request.json();
    
    const result = await pool.query(
      'INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, enrollment_date]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}