'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@/app/contexts/UserContext'
import { prisma } from '@/lib/prisma';
import { User, Trainer, ClassOffering} from '@/generated/prisma';
import { getAllUsers, getTrainer, searchMember} from '../actions/auth';
import { TrainerWorkData } from '../api/trainerWorkData/route';
// import { useRouter } from "next/navigation";

// app/api/trainer/[id]/work/route.ts
import { NextResponse } from 'next/server';

export default function TrainerHome(){
    const [refresh, setRefresh] = useState(false);
    const {user, setUser, logout } = useUser();
    const [ users, setUsers ] = useState<User[]>([]);
    // const [classData, setClassData] = useState<any>(null); // useState<ClassOffering[]>([]);
    const [trainerData, setTrainerData] = useState<TrainerWorkData[]>([]); // array of twd

    const [searchText, setSearchText] = useState("");//
    const [searchedMember, setSearchedMember] = useState<any>(null);//

    // Gets current trainer data + classes so all schedule info can be viewed
    const fetchTrainerData = async (trainerId: number) => {
      try {
        const response = await fetch(`/api/trainerWorkData?id=${trainerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trainerdata');
        }
        
        const data = await response.json();
        console.log(data);
        setTrainerData(data);
        return data;
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      //fetchClassOfferingsData();
      if(!user?.TrainerId) return;
      fetchTrainerData(user?.TrainerId);
    }, [user?.TrainerId]);
   
    const triggerRefresh = () => {
        setRefresh(!refresh);
    };

    // const router = useRouter();

    // const viewMember = () => {
    //     router.push("/trainer_home/view_member");
    // };

    const handleSearch = async () => {
      if (!searchText.trim()) return;

      const result = await searchMember(searchText);
      setSearchedMember(result);
    };

    return (
        <div className="flex min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
          <main className="flex min-h-screen w-full flex-col items-center justify-between py-16 px-8 bg-white dark:bg-black">
            <div className="w-full flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
                  Hello, Trainer {user?.name}
                </h1>
              </div>
            {!trainerData ? (
              <div className='w-full max-w-8xl flex items-center justify-center'>
                <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                  <p className="text-zinc-400">Loading profile...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-10">
              <div className="w-screen flex flex-col items-center gap-10">
                <div className="bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Class Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100 border-b text-black">
                          <tr>
                            <th className="py-3 px-4 text-left font-semibold">Class</th>
                            <th className="py-3 px-4 text-left font-semibold">Description</th>
                            <th className="py-3 px-4 text-left font-semibold">Trainer</th>
                            <th className="py-3 px-4 text-left font-semibold">Location</th>
                            <th className="py-3 px-4 text-left font-semibold">Room</th>
                            <th className="py-3 px-4 text-left font-semibold">Schedule</th>
                            <th className="py-3 px-4 text-left font-semibold">Duration (mins)</th>
                            <th className="py-3 px-4 text-left font-semibold">Capacity</th>
                            <th className="py-3 px-4 text-left font-semibold">Ateendees</th>
                            <th className="py-3 px-4 text-left font-semibold">Type</th>
                            <th className="py-3 px-4 text-left font-semibold">Goal Completed</th>
                            <th className="py-3 px-4 text-left font-semibold">Room Capacity</th>
                            
                          </tr>
                        </thead>
                          <tbody>
                            {trainerData.map((c: any) => (
                                      <tr key={c.id} className="border-b hover:bg-gray-50 text-black">
                                          <td className="py-2 px-4">{c.className}</td>
                                          <td className="py-2 px-4">{c.description}</td>
                                          <td className="py-2 px-4">{user?.name}</td>
                                          <td className="py-2 px-4">{c.room_location}</td>
                                          <td className="py-2 px-4">{c.roomNumber}</td>
                                          <td className="py-2 px-4">{new Date(c.scheduleTime).toLocaleString()}</td>
                                          <td className="py-2 px-4">{c.durationMins}</td>
                                          <td className="py-2 px-4">{c.capacityCount}</td>
                                          <td className="py-2 px-4">{c.attendeesCount}</td>
                                          <td className="py-2 px-4">{c.capacityCount==null ? "Personal Training" : "Group Class"}</td>
                                          <td className="py-2 px-4">{c.goal_completed}</td>
                                          <td className="py-2 px-4">{c.room_capacity}</td>
                                      </tr>
                            ))}
                          </tbody>
                      </table>
                    </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-center w-full">
                <div className="mt-10 bg-zinc-900 max-w-6xl border border-zinc-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Search Member Info</h2>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter name"
                        className="px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 w-full"
                      />
                      <button
                        onClick={handleSearch}
                        className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                      > Search </button>
                    </div>

                    {searchedMember && (
                      <div className="mt-6 text-white bg-zinc-800 p-4 rounded border border-zinc-700">
                        <h3 className="font-semibold text-lg mb-2">Member Info</h3>
                        <p><strong>Name:</strong> {searchedMember.user.name}</p>

                        <h4 className="font-semibold mt-4">Current Goals:</h4>
                        <p>Heartbeat: {searchedMember.heartbeatGoal ?? "Not set"}</p>
                        <p>Calories: {searchedMember.caloriesGoal ?? "Not set"}</p>
                        <p>Steps: {searchedMember.stepsGoal ?? "Not set"}</p>

                        <h4 className="font-semibold mt-4">Last Metric:</h4>
                        {searchedMember.healthMetrics.length > 0 ? (
                          <>
                            <p>Type: {searchedMember.healthMetrics[0].metricType}</p>
                            <p>Value: {searchedMember.healthMetrics[0].value}</p>
                          </>
                        ) : (
                          <p>No metrics recorded.</p>
                        )}
                      </div>
                    )}
                </div>
            </div>
            </div>
            )}
          </div>
        </main>
      </div>
    );
}