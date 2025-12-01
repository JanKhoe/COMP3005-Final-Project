'use client'
import { useState } from 'react';
import { useUser } from '@/app/contexts/UserContext'
import { User, Room } from '@/generated/prisma';
import { useEffect } from 'react';
import type { ClassOffering } from '@/generated/prisma';
import AddClassButton from '../components/AddClassBtn';
import { getAllUsers, getAllClasses, getAllRooms, deleteClassOffering } from '../actions/auth';

export default function AdminHome() {
  const [refresh, setRefresh] = useState(false);
  const { user, setUser, logout } = useUser();
  const [ users, setUsers ] = useState<User[]>([]);
  const [ classes, setClasses ] = useState<ClassOffering[]>([]);
  const [ rooms, setRooms ] = useState<Room[]>([]);
  const [classType, setClassType] = useState<"group" | "pt">("group");

  // Cannot call async function of getAllUsers() directly, need to use useEffect or similar
  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await getAllUsers();
      if (!allUsers) return;
      setUsers(allUsers);
    }
    fetchUsers();
  }, []);

  // Get all classes for admin view
  useEffect(() => {
    async function fetchClasses() {
      const allClasses = await getAllClasses();
      if (!allClasses) return;
      setClasses(allClasses);
    }
    fetchClasses();
  }, []);

  // Get all rooms for admin view
  useEffect(() => {
    async function fetchRooms() {
      const allRooms = await getAllRooms();
      if (!allRooms) return;
      setRooms(allRooms);
    }
    fetchRooms();
  }, []);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  // Helper function to handle finding type ID based on user type
  function getRoleId(user: {
    member?: { id: number } | null;
    trainer?: { id: number } | null;
    admin?: { id: number } | null;
    [key: string]: any;
  }) {
    // If member, trainer, or admin exists in User, return their ID
    if (user.member && user.member.id != null) return user.member.id;
    if (user.trainer && user.trainer.id != null) return user.trainer.id;
    if (user.admin && user.admin.id != null) return user.admin.id;
    // Otherwise return N/A
    return 'N/A';
  }

  // Helper function
  /*
  const getClassType = (c: ClassOffering) => {
    if (c.groupClass) return "Group Class";
    if (c.ptSession) return "Personal Training";
    return "Unknown";
  };
  */

  return (
  // Start of main container
  <div className="min-h-screen bg-zinc-50 dark:bg-black flex justify-center items-start py-20 px-4">
    <main className="w-full max-w-6xl">

      <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-10">
        Hello, {user?.name} <p className="text-red-500">(Admin)</p>
      </h1>

      {/* GRID FOR MULTIPLE TABLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

        {/* USERS TABLE */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Registered Users
          </h2>

          {/* Header */}
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">
              <tr>
                <th className="py-2 px-3 font-semibold">User ID</th>
                <th className="py-2 px-3 font-semibold">Name</th>
                <th className="py-2 px-3 font-semibold">Type</th>
                <th className="py-2 px-3 font-semibold">Type ID</th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="py-2 px-3">{u.id}</td>
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.typeOfUser}</td>
                  <td className="py-2 px-3">{getRoleId(u)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ROOM OPTIONS TABLE */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Room Options
          </h2>

          {/* Header */}
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">
              <tr>
                <th className="py-2 px-3 font-semibold">Room ID</th>
                <th className="py-2 px-3 font-semibold">Room Number</th>
                <th className="py-2 px-3 font-semibold">Capacity</th>
                <th className="py-2 px-3 font-semibold">Location</th>
              </tr>
            </thead>

            <tbody className="text-black dark:text-white">
              {rooms.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="py-2 px-3">{r.id}</td>
                  <td className="py-2 px-3">{r.roomNumber}</td>
                  <td className="py-2 px-3">{r.capacity}</td>
                  <td className="py-2 px-3">{r.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* CLASSOFFERING TABLES */}
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
                  {/* Conditional Columns */}
                  <td className="py-2 px-3">
                    {c.capacityCount ? c.capacityCount : "N/A"}
                  </td>
                  <td className="py-2 px-3">
                    {c.ptSession ? c.ptSession.memberId : "N/A"}
                  </td>
                  <td className="py-2 px-3">
                    {c.ptSession ? c.ptSession.goal : "N/A"}
                  </td>
                
                  {/* Delete button */}
                  <td className="py-2 px-3">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete "${c.className}"?`)) {
                          const result = await deleteClassOffering(c.id);

                          if (result.success) {
                            // Remove from state immediately
                            setClasses(prev => prev.filter(cls => cls.id !== c.id));
                          }
                        }
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

        {/* CREATE CLASS FORM */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-sm p-6">
          <div className="mt-6">
            <AddClassButton/>
          </div>
        </div>
        

    </main>
  </div>
  );
}
