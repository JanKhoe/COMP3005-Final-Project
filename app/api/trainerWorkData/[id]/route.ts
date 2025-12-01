import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// DELETE student
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await pool.query(
      'DELETE FROM students WHERE student_id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Student deleted successfully',
      student: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { email } = await request.json();
    
    const result = await pool.query(
      'UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *',
      [email, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating student:', error);
    
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}