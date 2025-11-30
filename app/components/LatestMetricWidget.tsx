'use client';

import React, { useState, useEffect } from 'react';
import { getMetricsForMember, getMember, updateMemberGoal } from '../actions/auth';
import { useUser } from '../contexts/UserContext';
import { MetricType } from '@/generated/prisma';
import { Member } from '@/generated/prisma';

type LatestMetricProps = {
  metricType: MetricType;
};

export default function MetricCard({ metricType }: LatestMetricProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  type ChartPoint = {
    value: number;
    time: string;
    fullDate: string;
  };

  const [data, setData] = useState<ChartPoint>();
  const [goal, setGoal] = useState<number | null>(null);
  const [newGoalValue, setNewGoalValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      
      const metrics = (await getMetricsForMember(user?.memberId))?.filter(
        (metric) => metric.metricType === metricType
      );
      
      if (!metrics || metrics.length === 0) {
        throw new Error("EMPTY");
      }
      
      const formattedData = metrics.map(metric => ({
        value: metric.value,
        time: new Date(metric.measuredAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: new Date(metric.measuredAt).toLocaleString()
      }));
      
      setData(formattedData[0]);
      
      const member = await getMember(user?.memberId);
      console.log(member);
      if(member){
        const goalVal = member[metricType + "Goal" as keyof typeof member]
        if(goalVal){
          setGoal(member[metricType + "Goal" as keyof typeof member]);
          setNewGoalValue(goalVal.toString());
        }
        
      }

      


      //TODO: need to set goal here
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setData(
        { time: 'Jan 7', value: 72, fullDate: 'Jan 7, 2024, 8:00 AM' }
      );
      setGoal(80);
      setNewGoalValue('80');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    const goalValue = parseFloat(newGoalValue);
    
    if (isNaN(goalValue) || goalValue <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    if (!user?.memberId) {
      alert('User not found');
      return;
    }

    setIsSaving(true);
    const result = await updateMemberGoal(user.memberId, metricType, goalValue);
    
    if (result.success) {
      setGoal(goalValue);
    } else {
      alert('Failed to update goal');
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-400">
          Latest {metricType}
        </h3>
        
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-bold text-white">
            {data?.value.toLocaleString()}
          </div>
          
          
            <div className="flex items-center gap-2">
              <span className="text-lg text-zinc-500">/</span>
              <input
                type="number"
                value={newGoalValue?.toString()}
                onChange={(e) => setNewGoalValue(e.target.value)}
                className="w-20 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Goal"
                autoFocus
                disabled={isSaving}
              />
              <div className="flex gap-1">
                <button
                  onClick={handleSaveGoal}
                  disabled={isSaving}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded transition-colors"
                >
                  {isSaving ? '...' : '✓'}
                </button>
              </div>
            </div>
          
        </div>
        
        <p className="text-sm text-zinc-500">
          {data?.fullDate}
        </p>
      </div>
    </div>
  );
}