'use client';

import { useState } from 'react';

type Props = {
  studentId: number;
  currentEmail: string;
  onRefresh: () => void;
};

export default function UpdateStudentButton({ studentId, currentEmail, onRefresh }: Props) {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!email.trim()) {
      alert('Email cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        console.log('Student email updated successfully');
        onRefresh();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Request failed:', (err as Error).message);
      alert('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
        disabled={loading}
      />
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}