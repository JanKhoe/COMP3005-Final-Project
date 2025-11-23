'use client';

import { useState } from 'react';

type Props = {
  studentId: number;
  onRefresh: () => void;
};

export default function DeleteStudentButton({ studentId, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Student deleted successfully');
        onRefresh();
      } else {
        const data = await response.json();
        console.error('Error deleting student:', data.error);
      }
    } catch (err) {
      console.error('Request failed:', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}