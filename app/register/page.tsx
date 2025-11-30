'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/auth';
import { useUser } from '@/app/contexts/UserContext';
import { Gender } from '@/generated/prisma';


export default function LoginPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>('OTHER');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate date format
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      setError('Date of Birth must be in YYYY/MM/DD format');
      setIsLoading(false);
      return;
    }

    const result = await registerUser(
      username,
      password,
      dateOfBirth,
      gender,
      allergies,
      medicalConditions
    );

    if (result.success) {
      setUser({
        id: result.user?.id,
        name: result.user?.name,
        typeOfUser: result.user?.typeOfUser,
        memberId: result.user?.member?.id
      });
      router.push('/home');
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black py-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8 text-black dark:text-white">
          Register
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Date of Birth (YYYY/MM/DD)
            </label>
            <input
              type="text"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="2000/01/15"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              required
              disabled={isLoading}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Allergies
            </label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="List any allergies..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white resize-none"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              Medical Conditions
            </label>
            <textarea
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="List any medical conditions..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white resize-none"
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create New User'}
          </button>
        </form>
      </div>
    </div>
  );
}