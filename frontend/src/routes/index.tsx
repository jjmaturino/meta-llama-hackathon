import { createFileRoute, Link } from '@tanstack/react-router'
import { useNotes } from '@/hooks/notes'
import NotesGraph from '@/components/NotesGraph'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { notes, isLoading, error } = useNotes();

  // Calculate tag counts
  const tagCounts = notes.reduce((acc: Record<string, number>, note) => {
    note.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Sort tags by count
  const sortedTags: Array<[string, number]> = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard</h1>
      
      {/* Top Section with Graph and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Knowledge Graph - Takes up 2/3 of the space */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Graph</h2>
            <div className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-600">
                  Error loading notes graph
                </div>
              ) : notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg
                    className="h-16 w-16 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Create some notes to see their relationships</p>
                </div>
              ) : (
                <NotesGraph 
                  notes={notes} 
                  onNodeClick={(noteId) => {
                    window.location.href = `/notes/${noteId}`;
                  }}
                  onRefresh={() => {
                    // Refetch notes data
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Stats Card - Takes up 1/3 of the space */}
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Notes</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{notes.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Most Used Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {sortedTags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
              <div className="mt-2 text-sm text-gray-600">
                {notes.length > 0 ? (
                  <ul className="space-y-2">
                    {notes.slice(0, 3).map(note => (
                      <li key={note.id} className="truncate">
                        <Link 
                          to="/notes/$slug" 
                          params={{ slug: note.id }}
                          className="hover:text-indigo-600"
                        >
                          {note.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section with Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Notes Card */}
        <Link
          to="/notes"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer text-left"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-gray-600">Create and manage your notes here.</p>
          {!isLoading && !error && (
            <div className="mt-4 text-sm text-gray-500">
              {notes.length} note{notes.length !== 1 ? 's' : ''} created
            </div>
          )}
        </Link>

        {/* Quizzes Card */}
        <Link
          to="/quizzes"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer text-left"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quizzes</h2>
          <p className="text-gray-600">Test your knowledge with interactive quizzes.</p>
        </Link>

        {/* Profile Card */}
        <Link
          to="/profile"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer text-left"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile</h2>
          <p className="text-gray-600">View and update your profile settings.</p>
        </Link>
      </div>
    </div>
  )
}
