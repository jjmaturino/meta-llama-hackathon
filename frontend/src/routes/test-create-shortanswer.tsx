/// <reference path="../types/speech-recognition.d.ts" />
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

interface Question {
  id: number;
  text: string;
  expectedAnswer: string; // This will be used by the LLM to evaluate the answer
}

// Mock questions (later will be generated from LLM based on notes)
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "Explain how photosynthesis works in simple terms.",
    expectedAnswer: "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into energy and oxygen."
  },
  {
    id: 2,
    text: "What are the main causes of climate change?",
    expectedAnswer: "The main causes of climate change include greenhouse gas emissions, deforestation, and industrial pollution."
  },
  {
    id: 3,
    text: "Describe the water cycle.",
    expectedAnswer: "The water cycle is the continuous movement of water through evaporation, condensation, precipitation, and collection in bodies of water."
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

export const Route = createFileRoute('/test-create-shortanswer')({
  component: TestCreateShortAnswerPage,
})

function TestCreateShortAnswerPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(mockQuestions.length).fill(''))
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isRaining, setIsRaining] = useState(false)
  const [score, setScore] = useState(0)

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognitionAPI()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        setTranscript(transcript)
        // Update the current answer
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = transcript
        setAnswers(newAnswers)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isListening && !showResults) {
        e.preventDefault()
        startListening()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isListening, showResults])

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  const calculateScore = () => {
    // For now, we'll use a simple similarity check
    // Later this will be replaced with LLM-based evaluation
    return answers.reduce((score, answer, index) => {
      const expectedAnswer = mockQuestions[index].expectedAnswer.toLowerCase()
      const userAnswer = answer.toLowerCase()
      
      // Simple word overlap calculation
      const expectedWords = new Set(expectedAnswer.split(' '))
      const userWords = new Set(userAnswer.split(' '))
      const overlap = [...expectedWords].filter(word => userWords.has(word)).length
      const maxWords = Math.max(expectedWords.size, userWords.size)
      
      return score + (overlap / maxWords) * 100
    }, 0) / mockQuestions.length
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTranscript('')
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
      setTranscript(answers[currentQuestion - 1])
    }
  }

  if (showResults) {
    return (
      <div className={`min-h-screen bg-gray-100 p-6 relative ${isRaining ? 'rain-effect' : ''}`}>
        {isRaining && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="rain">
              {[...Array(10)].map((_, i) => (
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
                  <p className="text-gray-600 mb-2">Your answer: {answers[index]}</p>
                  <p className="text-gray-600">Expected answer: {question.expectedAnswer}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers(Array(mockQuestions.length).fill(''))
                setShowResults(false)
                setTranscript('')
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
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value)
                    const newAnswers = [...answers]
                    newAnswers[currentQuestion] = e.target.value
                    setAnswers(newAnswers)
                  }}
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Press and hold spacebar to answer with voice..."
                />
                <button
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onMouseLeave={stopListening}
                  className={`absolute bottom-4 right-4 p-2 rounded-full ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {isListening ? 'Listening...' : 'Hold spacebar or click the microphone to speak'}
              </p>
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
              disabled={!answers[currentQuestion]}
              className={`px-4 py-2 rounded-md ${
                !answers[currentQuestion]
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