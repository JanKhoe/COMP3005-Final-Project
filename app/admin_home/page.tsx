'use client'
import { useState } from 'react';
import { useUser } from '@/app/contexts/UserContext'
import { MetricType } from '@/generated/prisma';
import HealthMetricsGraph from '../components/HealthMetricsGraph'
import MetricCard from '../components/LatestMetricWidget';
import { prisma } from '@/lib/prisma';


export default async function AdminHome() {
  const [refresh, setRefresh] = useState(false);
  const { user, setUser, logout } = useUser();
  const users = await prisma.user.findMany({
    include: {
      member: true
    }
  });

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  
  return (

    <div className="flex min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Hello, Admin {user?.name}
          </h1>
          

          <div className="w-screen flex flex-col items-center gap-10">

            <div className="overflow-x-auto rounded-xl border border-gray-300 shadow">
              <table className="min-w-full bg-white text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold">Timestamp</th>
                    <th className="py-3 px-4 text-left font-semibold">Metric</th>
                    <th className="py-3 px-4 text-left font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>

                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{u.id}</td>
                      <td className="py-2 px-4">{u.name}</td>
                      <td className="py-2 px-4">{u.typeOfUser}</td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
  
}
