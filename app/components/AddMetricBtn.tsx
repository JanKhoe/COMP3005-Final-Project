'use client';

import { useState } from 'react';
import { addMetric } from '../actions/auth';
import { MetricType } from '@/generated/prisma';
import { useUser } from '@/app/contexts/UserContext'

type ButtonProps = {
  type: MetricType;
};

export default function AddMetricButton({ type }: ButtonProps) {

  const { user, setUser, logout } = useUser()

  const [MetricInput, setMetricInput] = useState(0);


  const [MetricError, setMetricError] = useState(false);


  const [message, setMessage] = useState('');

  const handleAddMetric = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const result = await addMetric(type, MetricInput, user?.id);
  
      if (result.success) {
        //TODO: do something after the metric gets added in
      } else {
        //TODO otherwise just diplay an error
      }
      
    };

  return (
    <div className="flex gap-3 items-center">
      <button onClick={handleAddMetric} className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Metric
      </button>
      <input
        type="number"
        placeholder="Enter a value"
        value={MetricInput}
                onChange={(e) => {
                  setMetricInput(Number(e.target.value));
                  setMetricError(false);
                }}
        id="MetricValue"
        className={`px-4 py-2 border rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
          MetricError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-zinc-700'
        }`}
      />
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}