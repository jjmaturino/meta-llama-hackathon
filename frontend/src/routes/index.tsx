import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notes Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-gray-600">Create and manage your notes here.</p>
        </div>

        {/* Quizzes Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quizzes</h2>
          <p className="text-gray-600">Test your knowledge with interactive quizzes.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">View and update your profile settings.</p>
        </div>
      </div>
    </div>
  )
}
