import { createFileRoute } from '@tanstack/react-router'
import { useNote } from '@/hooks/notes'
import { useParams } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/notes/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = useParams({ from: '/notes/$slug' })
  const { note, isLoading, error } = useNote(slug)
  const [showQuestions, setShowQuestions] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading note: {error.message}</div>
      </div>
    )
  }

  // Generate questions from cues
  const questions = note.cues
    .split('\n')
    .filter(line => line.includes('Question:'))
    .map(line => line.replace('Question:', '').trim())

  // Categorize references
  const primaryRefs = note.docs.filter(doc => doc.includes('jalammar.github.io'));
  const secondaryRefs = note.docs.filter(doc => doc.includes('arxiv.org'));





  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
        <div className="flex items-center gap-2 mb-4">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
          
          {/* Dropdown */}
          <div 
            className="relative ml-2 group" 
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              className="px-4 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2 text-sm"
            >
              <span>Quick Links</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`absolute left-0 w-96 bg-white rounded-md shadow-lg z-10 border border-gray-200 transition-opacity duration-150 ${
                showDropdown ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ top: 'calc(100% - 2px)' }} // Remove the gap
            >
              {/* Primary Links */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Primary Sources</h3>
                <ul className="space-y-2">
                  {primaryRefs.map((doc, index) => (
                    <li key={`ref-${index}`}>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm block py-1"
                      >
                        {doc.includes('jalammar') ? 'Illustrated Guide to Transformers' : doc}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Secondary Links */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Secondary Sources</h3>
                <ul className="space-y-2">
                  {secondaryRefs.map((doc, index) => (
                    <li key={`ref-${index}`}>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm block py-1"
                      >
                        {`ArXiv Paper: ${doc.split('/').pop()}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary at the top */}
      <div className="mb-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="prose max-w-none">
            <ReactMarkdown>{note.summary}</ReactMarkdown>
          </div>
        </section>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left column */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Notes</h2>
            <div className="prose max-w-none">
              <ReactMarkdown>{note.notes}</ReactMarkdown>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{showQuestions ? 'Questions' : 'Cues'}</h2>
              <button
                onClick={() => setShowQuestions(!showQuestions)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Show {showQuestions ? 'Cues' : 'Questions'}
              </button>
            </div>
            <div className="prose max-w-none">
              {showQuestions ? (
                <div className="space-y-4">
                  {questions.length > 0 ? (
                    questions.map((question: string, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">Q{index + 1}: {question}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No questions found in cues.</p>
                  )}
                </div>
              ) : (
                <ReactMarkdown>{note.cues}</ReactMarkdown>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* References section at the bottom */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">References</h2>
        {/* Primary References */}
        {primaryRefs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Primary Sources</h3>
            <ul className="space-y-2">
              {primaryRefs.map((doc: string, index: number) => (
                <li key={index}>
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {doc.includes('jalammar') ? 'Illustrated Guide to Transformers' : doc}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Secondary References */}
        {secondaryRefs.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Secondary Sources</h3>
            <ul className="space-y-2">
              {secondaryRefs.map((doc: string, index: number) => (
                <li key={index}>
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {`ArXiv Paper: ${doc.split('/').pop()}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}