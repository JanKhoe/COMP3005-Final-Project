'use client';

import { useState } from 'react';
import { addClassOffering } from '../actions/auth';
import setClasses from '../admin_home/page';
import { refresh } from 'next/cache';
import { error } from 'console';

export default function AddClassButton() {

  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleTime, setScheduleTime] = useState<Date>(new Date());
  const [durationMins, setDurationMins] = useState(60);
  const [capacity, setCapacity] = useState(10);

  // Required foreign keys
  const [trainerId, setTrainerId] = useState<number>(1);
  const [roomId, setRoomId] = useState<number>(1);

  const [message, setMessage] = useState('');

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await addClassOffering(
      className,
      description,
      scheduleTime,
      durationMins,
      capacity,
      trainerId,
      roomId
    );

    if (result.success) {
      setMessage("Class created successfully! Refresh the page to see your changes.");
    } else {
      setMessage("Failed to create class." + (result.error ? ` Error: ${result.error}` : '' ));
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-bold">Create New Class</h2>

        <h1>Class Name: </h1>
        <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="px-3 py-2 border rounded"
        />

        <h1>Description: </h1>
        <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 border rounded"
        />

        <h1>Scheduled Time: </h1>
        <input
            type="datetime-local"
            value={scheduleTime.toISOString().slice(0, 16)}
            onChange={(e) => setScheduleTime(new Date(e.target.value))}
            className="px-3 py-2 border rounded"
        />

        <h1>Duration (mins): </h1>
        <input
            type="number"
            placeholder="Duration (mins)"
            value={durationMins}
            onChange={(e) => setDurationMins(Number(e.target.value))}
            className="px-3 py-2 border rounded"
        />

        <h1>Trainer ID (Type ID): </h1>
        <input
            type="number"
            placeholder="Trainer ID"
            value={trainerId}
            onChange={(e) => setTrainerId(Number(e.target.value))}
            className="px-3 py-2 border rounded"
        />

        <h1>Room ID: </h1>
        <input
            type="number"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            className="px-3 py-2 border rounded"
        />

        <p className="text-red-500 italic"> NOTE: Please ensure Trainer ID and Room ID exist in the system before creating a class. <br/>
                                            Also avoid creating classes that overlap in schedule for the same room.</p>
        <button
            onClick={handleAddClass}
            className="px-4 py-2 bg-green-600 text-white rounded"
        >
            Create Class
        </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}




