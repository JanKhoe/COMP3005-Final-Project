'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateMemberInfo, getMember } from '@/app/actions/auth';
import { useUser } from '@/app/contexts/UserContext';
import { Gender } from '@/generated/prisma';

export default function EditProfilePage() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>('OTHER');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    fetchMemberData();
  }, [user?.memberId]);

  const fetchMemberData = async () => {
    if (!user?.memberId) {
      
      return;
    }

    setIsFetching(true);
    const member = await getMember(user.memberId);
    
    if (member) {
      // Format date to YYYY/MM/DD
      if (member.dob) {
        const date = new Date(member.dob);
        const formatted = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
        setDateOfBirth(formatted);
      }
      setGender(member.gender || 'OTHER');
      setAllergies(member.allergies || '');
      setMedicalConditions(member.medicalConditions || '');
    }
    
    setIsFetching(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
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

    if (!user?.memberId) {
      setError('User not found');
      setIsLoading(false);
      return;
    }

    const result = await updateMemberInfo(
      user.memberId,
      dateOfBirth,
      gender,
      allergies,
      medicalConditions
    );

    if (result.success) {
      router.push('/home');
    } else {
      setError(result.error || 'Update failed');
    }
    
    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black py-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Edit Profile
          </h1>
          <button
            onClick={() => router.push('/home')}
            className="text-sm text-zinc-400 hover:text-zinc-300"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
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
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-zinc-700 border-zinc-600 text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-500 mt-1">Username cannot be changed</p>
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
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
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
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}