import { createFileRoute } from '@tanstack/react-router'
import { useNotes } from '@/hooks/notes'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { notes, isLoading } = useNotes();
  const [profileImage, setProfileImage] = useState<string>('/llambert.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/llambert.png';
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Llambert</h2>
            <p className="text-gray-500">Llambert@llama.com</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="bg-gray-50 px-4 py-5 rounded-lg sm:p-6">
                  <dt className="text-sm font-medium text-gray-500">Total Notes</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {isLoading ? (
                      <div className="animate-pulse h-8 w-8 bg-gray-200 rounded"></div>
                    ) : (
                      notes.length
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 rounded-lg sm:p-6">
                  <dt className="text-sm font-medium text-gray-500">Completed Quizzes</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 rounded-lg sm:p-6">
                  <dt className="text-sm font-medium text-gray-500">Average Quiz Score</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">-</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 rounded-lg sm:p-6">
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-4 text-center text-gray-500">
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 