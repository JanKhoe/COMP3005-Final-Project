'use client';

import { useState } from 'react';

type Props = {
    onRefresh: () => void;
  };

export default function AddStudentButton({ onRefresh }: Props) {

  

  const [fNameInput, setFNameInput] = useState('');
  const [lNameInput, setLNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [enrollDateInput, setEnrollDateInput] = useState('');

  const [fNameError, setFNameError] = useState(false);
  const [lNameError, setLNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [enrollDateError, setEnrollDateError] = useState(false);

  const [message, setMessage] = useState('');

  const handleAddStudent = async () => {

    console.log('here2')
    
    setMessage('');
    let hasError = false;

    setFNameError(false);
    setLNameError(false);
    setEmailError(false);
    setEnrollDateError(false);

    if(!fNameInput.trim()){
      setFNameError(true);
      hasError = true;
    }

    if(!lNameInput.trim()){
      setLNameError(true);
      hasError =true;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if(!emailInput.trim() ||!emailRegex.test(emailInput) ){
      
      console.log("email has wrong format")
        setEmailError(true);
        hasError = true;
    }
  

    if(!enrollDateInput.trim()){
      setEnrollDateError(true);
      hasError = true;
    }

    console.log(fNameInput, lNameInput, emailInput, enrollDateInput);

    if(hasError){
      setMessage('please fill out all fields!');
      return;
    } 
    
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fNameInput,
          last_name: lNameInput,
          email: emailInput,
          enrollment_date: enrollDateInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Student added! ID: ${data.student_id}`);
        onRefresh();
        setEmailInput('');
        setFNameInput('');
        setLNameInput('');
        setEnrollDateInput('');
        console.log("student successfully added to database");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`Request failed: ${(err as Error).message}`);
    }
    };

  return (
    <div className="flex gap-3 items-center">
      <button onClick={handleAddStudent} className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Student
      </button>
      <input
        type="text"
        placeholder="First Name"
        value={fNameInput}
                onChange={(e) => {
                  setFNameInput(e.target.value);
                  setFNameError(false);
                }}
        id="studentFName"
        className={`px-4 py-2 border rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
          fNameError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-zinc-700'
        }`}
      />
      <input
        type="text"
        placeholder="Last Name"
        id="studentLName"

        value={lNameInput}
                onChange={(e) => {
                  setLNameInput(e.target.value);
                  setLNameError(false);
                }}
        className={`px-4 py-2 border rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
          lNameError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-zinc-700'
        }`}
      />
      <input
        type="text"
        placeholder="Email"
        id="studentEmail"
        value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError(false);
                }}
        className={`px-4 py-2 border rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
          emailError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-zinc-700'
        }`}         
      />
      <input
        type="date"
        id="studentEnrollDate"
        value={enrollDateInput}
                onChange={(e) => {
                  setEnrollDateInput(e.target.value);
                  setEnrollDateError(false);
                }}
        className={`px-4 py-2 border rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
          enrollDateError 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-gray-300 dark:border-zinc-700'
        }`}
        />
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
