import { createFileRoute, Link } from '@tanstack/react-router';

interface QuizSearchParams {
  noteId?: string;
}

export const Route = createFileRoute('/quizzes/')({
  validateSearch: (search: Record<string, unknown>): QuizSearchParams => {
    return {
      noteId: search.noteId as string | undefined,
    };
  },
  component: QuizSelectionPage,
});

function QuizSelectionPage() {
  const { search } = Route.useMatch();
  const { noteId } = search;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Quiz Type</h1>
          <p className="text-lg text-gray-600">Select the type of quiz you'd like to take</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Multiple Choice Quiz Card */}
          <Link
            to="/test-create-multiselect"
            search={{ noteId }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Multiple Choice Quiz</h2>
              <p className="text-gray-600">
                Test your knowledge with pre-defined options. Select the best answer from multiple choices.
              </p>
            </div>
          </Link>

          {/* Short Answer Quiz Card */}
          <Link
            to="/test-create-shortanswer"
            search={{ noteId }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Short Answer Quiz</h2>
              <p className="text-gray-600">
                Write your answers in your own words. Test your deep understanding of the material.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 