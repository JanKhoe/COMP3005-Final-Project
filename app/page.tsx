'use client'
import { useState } from 'react';
import AddStudentButton from "./components/AddStudentButton";
import StudentTable from "./components/StudentTable";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(!refresh);
  };

  

  return (
    <div className="flex min-h-screen items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Student Database
          </h1>
          <AddStudentButton onRefresh={triggerRefresh}/>

          <div className="mt-8 w-full">
            <StudentTable refresh={refresh} onRefresh={triggerRefresh} />
          </div>
        </div>
      </main>
    </div>
  );
}
