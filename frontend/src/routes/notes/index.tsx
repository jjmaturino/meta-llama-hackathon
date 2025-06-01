import { useNotes, type Note } from '@/hooks/notes'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/')({
  component: NotesPage,
})

function NotesPage() {
  const { notes, isLoading, error } = useNotes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center text-red-600">
            <p>Error loading notes. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new note.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: Note) => (
            <Link
              key={note.id}
              to="/notes/$slug"
              params={{ slug: note.id }}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 block"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {note.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 text-sm font-medium">
                  View Details
                </span>
                <div className="text-gray-400 text-sm">
                  {note.docs.length} reference{note.docs.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 