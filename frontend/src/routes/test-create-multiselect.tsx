import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import confetti from 'canvas-confetti'

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Mock questions (later will be generated from LLM)
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
    correctAnswer: 1
  }
]

// Function to trigger confetti
const triggerConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 }
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export const Route = createFileRoute('/test-create-multiselect')({
  component: TestCreatePage,
})

function TestCreatePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(mockQuestions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [isRaining, setIsRaining] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === mockQuestions[index].correctAnswer ? 1 : 0)
    }, 0)
    return (correctAnswers / mockQuestions.length) * 100
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const finalScore = calculateScore()
      setScore(finalScore)
      setShowResults(true)
      
      // Trigger effects based on score
      if (finalScore >= 70) {
        triggerConfetti()
      } else {
        setIsRaining(true)
        // Play thunder sound
        new Audio('/thunder.mp3').play().catch(() => {})
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (showResults) {
    return (
      <div className={`min-h-screen bg-gray-100 p-6 relative ${isRaining ? 'rain-effect' : ''}`}>
        {isRaining && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="rain">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="raindrop" />
              ))}
            </div>
            <div className="lightning"></div>
          </div>
        )}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                {Math.round(score)}%
              </div>
              <div className="text-lg text-gray-600">
                {score >= 70 ? 'Great job! 🎉' : 'Keep practicing! 💪'}
              </div>
            </div>
            <div className="space-y-6">
              {mockQuestions.map((question, index) => (
                <div key={question.id} className="border-b pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Question {index + 1}: {question.text}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Your answer: {question.options[selectedAnswers[index]]}
                  </p>
                  <p className="text-gray-600">
                    Correct answer: {question.options[question.correctAnswer]}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers(Array(mockQuestions.length).fill(-1))
                setShowResults(false)
                setIsRaining(false)
              }}
              className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = mockQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </h2>
              <span className="text-sm text-gray-500">
                Progress: {Math.round(((currentQuestion + 1) / mockQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
              className={`px-4 py-2 rounded-md ${
                selectedAnswers[currentQuestion] === -1
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {currentQuestion === mockQuestions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 