'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@/app/contexts/UserContext'
import { MetricType } from '@/generated/prisma';
import HealthMetricsGraph from '../components/HealthMetricsGraph'
import MetricCard from '../components/LatestMetricWidget';
import { getMember } from '../actions/auth';
import { useRouter } from "next/navigation";
import { Prisma } from '@/generated/prisma';
import { getAllClasses, registerForClassOffering } from '../actions/auth';

export default function Home() {

  type ClassOfferingWithIncludes = Prisma.ClassOfferingGetPayload<{
    include: {
        trainer: true;
        room: true;
        groupClass: true;
        ptSession: true;
      };
    }>;

  const [refresh, setRefresh] = useState(false);
  const { user, setUser, logout } = useUser();
  const [memberData, setMemberData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ classes, setClasses ] = useState<ClassOfferingWithIncludes[]>([]);

  useEffect(() => {
    fetchMemberData();
  }, [user?.memberId]);

    useEffect(() => {
      async function fetchClasses() {
        const allClasses = await getAllClasses();
        if (!allClasses) return;
        setClasses(allClasses);
      }
      fetchClasses();
    }, []);

  const fetchMemberData = async () => {
    if (!user?.memberId) return;
    
    setIsLoading(true);
    const member = await getMember(user.memberId);
    console.log(member)
    setMemberData(member);
    setIsLoading(false);
  };

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not provided';
    console.log(date);
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const router = useRouter();

  const editProfile = () => {
    router.push("/home/edit");
  };

  const calculateAge = (dateOfBirth: Date | null | undefined) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = dateOfBirth;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black">
        <div className="w-full flex flex-col gap-8">
          
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
              Hello, {user?.name}
            </h1>
            <button
              onClick={editProfile}
              className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>

          {isLoading ? (
            <div className='w-full max-w-8xl flex items-center justify-center'>
              <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                <p className="text-zinc-400">Loading profile...</p>
              </div>
            </div>
            
          ) : memberData ? (
            <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <p className="text-sm text-zinc-400">Date of Birth</p>
                  <p className="text-white">
                    {formatDate(new Date(memberData.dob))}
                    {memberData.dob && (
                      <span className="text-zinc-500 ml-2">
                        ({calculateAge(memberData.dob)} years old)
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Gender</p>
                  <p className="text-white capitalize">
                    {memberData.gender?.replace(/_/g, ' ') || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Allergies</p>
                  <p className="text-white">
                    {memberData.allergies || 'None listed'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Medical Conditions</p>
                  <p className="text-white">
                    {memberData.medicalConditions || 'None listed'}
                  </p>
                </div>

              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-8 mt-4">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              Health Metrics
            </h2>

            <div className="flex flex-col gap-8">
              <div className="w-full flex items-center flex-col">
                <HealthMetricsGraph metricType={MetricType.heartbeat} />
                <MetricCard metricType={MetricType.heartbeat} />
              </div>

              <div className="w-full flex items-center flex-col">
                <HealthMetricsGraph metricType={MetricType.steps} />
                <MetricCard metricType={MetricType.steps} />
              </div>

              <div className="w-full flex items-center flex-col">
                <HealthMetricsGraph metricType={MetricType.calories} />
                <MetricCard metricType={MetricType.calories} />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-sm p-6 mb-2">
                    <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                      Registered Classes
                    </h2>
          
                    {/* Header */}
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Class</th>
                          <th className="py-2 px-3 font-semibold">Description</th>
                          <th className="py-2 px-3 font-semibold">Scheduled Time</th>
                          <th className="py-2 px-3 font-semibold">Duration</th>
                          <th className="py-2 px-3 font-semibold">Trainer</th>
                          <th className="py-2 px-3 font-semibold">Room</th>
                          <th className="py-2 px-3 font-semibold">Class Type</th>
                          <th className="py-2 px-3 font-semibold">Capacity</th>
                          <th className="py-2 px-3 font-semibold">Member ID</th>
                          <th className="py-2 px-3 font-semibold">Goal</th>
                        </tr>
                      </thead>
          
                      <tbody className="text-black dark:text-white">
                        {classes.map((c) => (
                          <tr
                            key={c.id}
                            className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                          >
                            <td className="py-2 px-3">{c.className}</td>
                            <td className="py-2 px-3">{c.description}</td>
                            <td className="py-2 px-3">{c.scheduleTime.toLocaleTimeString()}</td>
                            <td className="py-2 px-3">{c.durationMins} mins</td>
                            <td className="py-2 px-3">{c.trainerId}</td>
                            <td className="py-2 px-3">{c.roomId}</td>
                            <td className="py-2 px-3">{c.classType}</td>
                            {/* Conditional Columns */}
                            <td className="py-2 px-3">
                              {c.groupClass?.capacityCount ? c.groupClass?.capacityCount : "N/A"}
                            </td>
                            <td className="py-2 px-3">
                              {c.ptSession ? c.ptSession.memberId : "N/A"}
                            </td>
                            <td className="py-2 px-3">
                              {c.ptSession ? c.ptSession.goal : "N/A"}
                            </td>
                          
                            {/* Register button */}
                            <td className="py-2 px-3">
                              <button
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={async () => {
                                  console.log('registered')
                                  if(!user?.memberId) return;
                                  registerForClassOffering(c.id, user?.memberId);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

        </div>
      </main>
    </div>
  );
}