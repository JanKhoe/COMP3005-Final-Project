'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { getMetricsForMember } from '../actions/auth';
import { useUser } from '../contexts/UserContext';
import { MetricType } from '@/generated/prisma';
import AddMetricButton from './AddMetricBtn';
import MetricCard from './LatestMetricWidget';

// This component fetches and displays health metrics over time
// For the actual implementation, you'll need to:
// 1. Create a Prisma schema with a HealthMetric model
// 2. Create an API route at /api/health-metrics
// 3. Query your database using Prisma Client

type HealthMetricsGraphProps = {
  metricType: MetricType;
};

export default function HealthMetricsGraph({ metricType }: HealthMetricsGraphProps) {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser, logout } = useUser();


  type ChartPoint = {
        
        value: number;
        time: string;
        fullDate: string;
    };

    const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const metrics = (await getMetricsForMember(user?.id))?.filter(
        
        (metric) => metric.metricType === metricType
      );
      
       if(!metrics || metrics.length == 0){
        throw new Error("EMPTY");
       }
      
      // Format data for the chart
      const formattedData = metrics.map(metric => ({
        value: metric.value,
        time: new Date(metric.measuredAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: new Date(metric.measuredAt).toLocaleString()
      }));
      
      setData(formattedData);
      setError(null);
    } catch (err : any) {
      setError(err.message);
      // Use demo data for preview
      setData([
        { time: 'Jan 1', value: 72, fullDate: 'Jan 1, 2024, 8:00 AM' },
        { time: 'Jan 2', value: 68, fullDate: 'Jan 2, 2024, 8:00 AM' },
        { time: 'Jan 3', value: 75, fullDate: 'Jan 3, 2024, 8:00 AM' },
        { time: 'Jan 4', value: 70, fullDate: 'Jan 4, 2024, 8:00 AM' },
        { time: 'Jan 5', value: 73, fullDate: 'Jan 5, 2024, 8:00 AM' },
        { time: 'Jan 6', value: 69, fullDate: 'Jan 6, 2024, 8:00 AM' },
        { time: 'Jan 7', value: 71, fullDate: 'Jan 7, 2024, 8:00 AM' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-md border border-zinc-800">
        <div className="flex items-center justify-center h-96">
            <AddMetricButton metricType={metricType} ></AddMetricButton>
          <div className="animate-pulse flex flex-col items-center">
            <Activity className="w-12 h-12 text-blue-400 mb-2" />
            <p className="text-zinc-400">Loading health metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-md border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
              <AddMetricButton metricType={metricType} ></AddMetricButton>
          </div>
        <div className="flex items-center gap-3 mb-6">
          
          <Activity className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-zinc-100"> {metricType.toLocaleUpperCase()} </h2>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-200">
              Using demo data. Error: {error}
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis 
              dataKey="time" 
              stroke="#a1a1aa"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#a1a1aa"
              style={{ fontSize: '14px' }}
              label={{ value: 'Unit', angle: -90, position: 'insideLeft' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
