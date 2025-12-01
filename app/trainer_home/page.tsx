'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@/app/contexts/UserContext'
import { prisma } from '@/lib/prisma';
import { MetricType, User, Trainer, ClassOffering} from '@/generated/prisma';
import { getClassOfferings } from '../actions/auth';
//import { getAllUsers } from '../actions/auth';
import { getTrainer } from '../actions/auth';
// import { useRouter } from "next/navigation";

// app/api/trainer/[id]/work/route.ts
import { NextResponse } from 'next/server';



export default function TrainerHome(){
    const [refresh, setRefresh] = useState(false);
    const {user, setUser, logout } = useUser();
    const [ users, setUsers ] = useState<User[]>([]);
    const [classData, setClassData] = useState<any>(null); // useState<ClassOffering[]>([]);
    // const [trainerData, setTrainerData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTrainerData = async () => {
      try {
        const response = await fetch('/api/trainerWorkData');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trainerdata');
        }
        
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log(err)
      }
    };

    useEffect(() => {
        //fetchClassOfferingsData();
        fetchTrainerData();
    }, [user?.TrainerId]);

    const fetchClassOfferingsData = async () => {
        if (!user?.TrainerId) return;
            setIsLoading(true);
            const classData = await getClassOfferings(user.TrainerId);
            console.log(classData)
            setClassData(classData);  
            setIsLoading(false);



            
        }
   
    const triggerRefresh = () => {
        setRefresh(!refresh);
    };

    // const router = useRouter();

    // const viewMember = () => {
    //     router.push("/trainer_home/view_member");
    // };

    return (
        <div className="flex min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
          <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black">
            <div className="w-full flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
                  Hello, Trainer {user?.name}
                </h1>
                {/* <button
                  onClick={editProfile}
                  className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Edit Profile
                </button> */}
              </div>
              {isLoading ? (
                <div className='w-full max-w-8xl flex items-center justify-center'>
                  <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                    <p className="text-zinc-400">Loading profile...</p>
                  </div>
                </div>
              ) : classData ? (
                    <div className="w-screen flex flex-col items-center gap-10">
                        <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Class Schedule</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <table className="min-w-full bg-white text-sm">
                                        <thead className="bg-gray-100 border-b text-black">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-semibold">Class Name</th>
                                            <th className="py-3 px-4 text-left font-semibold">Trainer</th>
                                            <th className="py-3 px-4 text-left font-semibold">Room</th>
                                            <th className="py-3 px-4 text-left font-semibold">Schedule</th>
                                            <th className="py-3 px-4 text-left font-semibold">Duration (mins)</th>
                                            <th className="py-3 px-4 text-left font-semibold">Capacity</th>
                                        </tr>
                                        </thead>
                                    <tbody>
                                    {classData.map((c: any) => (
                                        <tr key={c.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="py-2 px-4">{c.className}</td>
                                            <td className="py-2 px-4">{c.trainer?.user?.name}</td>
                                            <td className="py-2 px-4">{c.room.roomName}</td>
                                            <td className="py-2 px-4">{new Date(c.scheduleTime).toLocaleString()}</td>
                                            <td className="py-2 px-4">{c.durationMins}</td>
                                            <td className="py-2 px-4">{c.capacity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
              ) : null}
            </div>
          </main>
        </div>
    );
}


