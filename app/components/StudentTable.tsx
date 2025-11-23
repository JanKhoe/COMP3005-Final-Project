'use client';

import { useEffect, useState } from 'react';
import DeleteStudentButton from './DeleteStudentButton';
import UpdateStudentButton from './UpdateStudentButton';

type Student = {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
  enrollment_date: string;
};

type Props = {
  refresh: boolean;
  onRefresh: () => void;
};

export default function StudentTable({ refresh, onRefresh }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students');
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Error loading students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [refresh]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center text-gray-500">
        Loading students...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-zinc-800">
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              ID
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              First Name
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Last Name
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Email
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Enrollment Date
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr 
              key={student.student_id}
              className="border-b border-gray-100 dark:border-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-900"
            >
              <td className="p-3 text-sm text-gray-900 dark:text-zinc-100">
                {student.student_id}
              </td>
              <td className="p-3 text-sm text-gray-900 dark:text-zinc-100">
                {student.first_name}
              </td>
              <td className="p-3 text-sm text-gray-900 dark:text-zinc-100">
                {student.last_name}
              </td>
              <td className="p-3 text-sm text-gray-900 dark:text-zinc-100">
                {student.email}
              </td>
              <td className="p-3 text-sm text-gray-900 dark:text-zinc-100">
                {new Date(student.enrollment_date).toLocaleDateString()}
              </td>
              <td className="p-3 text-sm">
                <div className="flex gap-4 items-center">
                  <UpdateStudentButton 
                    studentId={student.student_id} 
                    currentEmail={student.email}
                    onRefresh={onRefresh} 
                  />
                  <DeleteStudentButton 
                    studentId={student.student_id} 
                    onRefresh={onRefresh} 
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}