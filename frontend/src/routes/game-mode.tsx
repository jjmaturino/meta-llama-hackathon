import { createFileRoute, Link } from '@tanstack/react-router';

interface GameModeSearchParams {
  noteId?: string;
  quizType: 'multiselect' | 'shortanswer';
}

export const Route = createFileRoute('/game-mode')({
  validateSearch: (search: Record<string, unknown>): GameModeSearchParams => {
    return {
      noteId: search.noteId as string | undefined,
      quizType: search.quizType as 'multiselect' | 'shortanswer',
    };
  },
  component: GameModePage,
});

function GameModePage() {
  const { search } = Route.useMatch();
  const { noteId, quizType } = search;

  const targetRoute = quizType === 'multiselect' ? '/test-create-multiselect' : '/test-create-shortanswer';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Game Mode</h1>
          <p className="text-lg text-gray-600">How would you like to play?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Singleplayer Card */}
          <Link
            to={targetRoute}
            search={{ noteId, mode: 'single' }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Singleplayer</h2>
              <p className="text-gray-600">
                Test your knowledge at your own pace. Perfect for focused learning and self-assessment.
              </p>
            </div>
          </Link>

          {/* Multiplayer Card */}
          <Link
            to={targetRoute}
            search={{ noteId, mode: 'multi' }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Multiplayer</h2>
              <p className="text-gray-600">
                Challenge your friends in real-time. Compete and learn together in an engaging quiz battle.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/quiz-selection"
            search={{ noteId }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Back to Quiz Selection
          </Link>
        </div>
      </div>
    </div>
  );
} 