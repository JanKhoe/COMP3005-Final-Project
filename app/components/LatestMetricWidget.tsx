'use client';

import React, { useState, useEffect } from 'react';
import { getMetricsForMember } from '../actions/auth';
import { useUser } from '../contexts/UserContext';
import { MetricType } from '@/generated/prisma';

// This component fetches and displays health metrics over time
// For the actual implementation, you'll need to:
// 1. Create a Prisma schema with a HealthMetric model
// 2. Create an API route at /api/health-metrics
// 3. Query your database using Prisma Client

type LatestMetricProps = {
  metricType: MetricType;
};

export default function HealthMetricsGraph({ metricType }: LatestMetricProps) {
  
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
      
      setData([formattedData[0]]);
      setError(null);
    } catch (err : any) {
      setError(err.message);
      // Use demo data for preview
      setData([
        { time: 'Jan 1', value: 72, fullDate: 'Jan 1, 2024, 8:00 AM' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-md border border-zinc-800">
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <p className="text-zinc-400">Loading health metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-md border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
            
        </div>
      <div className="flex items-center gap-3 mb-6">
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
    </div>
  );
};
