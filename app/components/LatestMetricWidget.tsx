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

export default function MetricCard({ metricType }: LatestMetricProps) {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser, logout } = useUser();


  type ChartPoint = {
        
        value: number;
        time: string;
        fullDate: string;
    };

    const [data, setData] = useState<ChartPoint>();

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
      
      setData(formattedData[0]);
      setError(null);
    } catch (err : any) {
      setError(err.message);
      // Use demo data for preview
      setData(
        { time: 'Jan 7', value: 72, fullDate: 'Jan 7, 2024, 8:00 AM' }
      );
    } finally {
      setLoading(false);
    }
  };


    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-zinc-400">
            Latest {metricType}
          </h3>
          
          <div className="text-4xl font-bold text-white">
            {data?.value}
          </div>
          
          <p className="text-sm text-zinc-500">
            {data?.fullDate}
          </p>
        </div>
      </div>
    );
};
