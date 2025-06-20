'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { zIndex } from '@/lib/z-index'

interface Question {
  id: string
  question: string
  answer: string
  category: string
}

const predefinedQuestions: Question[] = [
  // Booking & Appointments
  {
    id: '1',
    category: 'Booking',
    question: 'How do I book an appointment?',
    answer: 'Book online via "Book Now" buttons or call/text 678-789-4200. We use Boulevard for scheduling.'
  },
  {
    id: '2',
    category: 'Booking',
    question: 'What is your cancellation & rescheduling policy?',
    answer: '48 hour notice required. Late cancels/reschedules/no-shows may be charged. Full details on our Policies page.'
  },
  
  // Services
  {
    id: '3',
    category: 'Services',
    question: 'What services do you offer?',
    answer: 'Cosmetic/paramedical tattooing, facials, peels, lash extensions, lash lift and tints, spray tans, body & brow grooming, training, and more. Injectables and hormone therapy coming soon.'
  },
  {
    id: '4',
    category: 'Services',
    question: 'What is permanent makeup?',
    answer: 'Cosmetic tattooing simulates or enhances your natural brows, lips, eyeliner, etc. Lasts 1–3+ years depending on skin and aftercare. We also offer additional cosmetic tattooing such as freckles, beauty marks, and cheek blush.'
  },
  {
    id: '5',
    category: 'Services',
    question: 'Do you offer medical tattooing?',
    answer: 'Yes—areola reconstruction, scar/stretch mark camouflage, scalp micropigmentation, and hypopigmentation revision.'
  },
  {
    id: '6',
    category: 'Services',
    question: 'What facial treatments are available?',
    answer: 'Hydrating, anti-aging, acne facials, peels, dermaplaning, and custom skin treatments, both pampering and resurfacing services are available.'
  },
  {
    id: '7',
    category: 'Services',
    question: 'What eyelash services do you provide?',
    answer: 'Lash lifts, tints, light cured classic/ hybrid/volume extensions, and maintenance fills.'
  },
  
  // Pricing & Payment
  {
    id: '8',
    category: 'Pricing',
    question: 'Do you offer financing?',
    answer: 'Yes—Cherry Financing with no credit impact. Apply through our website.'
  },
  {
    id: '9',
    category: 'Pricing',
    question: 'What payment methods do you accept?',
    answer: 'Cash, all major cards, Cherry Financing, and our in-house gift certificates.'
  },
  {
    id: '10',
    category: 'Pricing',
    question: 'Can I buy a gift certificate?',
    answer: 'Yes—available online or in person. Good for any service.'
  },
  
  // Location & Contact
  {
    id: '11',
    category: 'Contact',
    question: 'Where are you located?',
    answer: '104 Covington St, Loganville, GA 30052. Map is on our site. Parking available.'
  },
  {
    id: '12',
    category: 'Contact',
    question: 'What are your hours?',
    answer: 'Vary by provider. Booking site shows availability or text/call us.'
  },
  {
    id: '13',
    category: 'Contact',
    question: 'How can I contact you?',
    answer: 'Call/text 678-789-4200, email Service@SplendidBeautyBar.co, or DM us on socials.'
  },
  
  // Academy & Training
  {
    id: '14',
    category: 'Academy',
    question: 'Do you offer beauty training?',
    answer: 'Yes—certified courses and hands-on apprenticeships and course training starting.'
  },
  
  // Hair Studio
  {
    id: '15',
    category: 'Hair Studio',
    question: 'Do you rent booth space?',
    answer: 'Yes—Hair Studio and service booth rentals available. Contact us for current rates and openings.'
  },
  
  // Policies
  {
    id: '16',
    category: 'Policies',
    question: 'Are you inclusive of all clients?',
    answer: '100%. We welcome all people and have a strict non-discrimination policy.'
  },
  {
    id: '17',
    category: 'Policies',
    question: 'What safety measures do you have?',
    answer: 'Strict sanitation, single-use tools, and compliance with state, county, and health department standards.'
  },
  
  // General
  {
    id: '18',
    category: 'General',
    question: 'Who are the founders?',
    answer: 'Christine Eaton and Eden York—focused on inclusive, luxury beauty for all.'
  },
  {
    id: '19',
    category: 'General',
    question: 'Can I see examples of your work?',
    answer: 'Yes—check our Portfolio or follow us @SplendidBeautyBarAndCo on IG/FB.'
  },
  {
    id: '20',
    category: 'General',
    question: 'Do you sell beauty products?',
    answer: 'Yes—online shop features our go-to professional products. Link in bio or Shop section.'
  }
]

const categories = ['All', 'Booking', 'Services', 'Pricing', 'Contact', 'Academy', 'Hair Studio', 'Policies', 'General']

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Filter questions by category
  const filteredQuestions = selectedCategory === 'All' 
    ? predefinedQuestions 
    : predefinedQuestions.filter(q => q.category === selectedCategory)

  // Close widget when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Show pulse animation on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setHasInteracted(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [hasInteracted])

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.8, 
          type: 'spring', 
          stiffness: 200, 
          damping: 15,
          opacity: { duration: 0.3 }
        }}
        onClick={() => {
          setIsOpen(true)
          setHasInteracted(true)
        }}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#063f48] text-white shadow-lg",
          "hover:bg-[#05535e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#063f48]",
          "flex items-center justify-center transition-all duration-200",
          !isOpen && "hover:scale-110"
        )}
        aria-label="Open help chat"
        style={{ zIndex: zIndex.floatingChatButton }}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        {!hasInteracted && (
          <span className="absolute flex h-3 w-3 -top-1 -right-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" style={{ animationDuration: '1.5s' }}></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25,
              duration: 0.3
            }}
            className={cn(
              "fixed bg-white rounded-lg shadow-2xl overflow-hidden",
              "bottom-20 right-4 sm:bottom-24 sm:right-6",
              "w-[90vw] max-w-[380px]",
              "h-[85vh] sm:h-[75vh] md:h-[70vh] max-h-[600px]",
              "flex flex-col"
            )}
            style={{ zIndex: zIndex.floatingChatWidget }}
          >
            {/* Header */}
            <div className="bg-[#063f48] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedQuestion && (
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="hover:bg-white/10 rounded p-1 transition-colors"
                    aria-label="Back to questions"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedQuestion ? 'Answer' : 'How can we help?'}
                  </h3>
                  {!selectedQuestion && (
                    <p className="text-sm opacity-90">Quick answers to common questions</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setSelectedQuestion(null)
                }}
                className="hover:bg-white/10 rounded p-1 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedQuestion ? (
                // Answer View
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                    {selectedQuestion.question}
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedQuestion.answer}
                  </p>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="mt-6 text-[#063f48] hover:text-[#05535e] font-medium text-sm transition-colors"
                  >
                    ← Back to all questions
                  </button>
                </div>
              ) : (
                <>
                  {/* Category Filter */}
                  <div className="p-3 sm:p-4 border-b bg-gray-50">
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            "px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0",
                            selectedCategory === category
                              ? "bg-[#063f48] text-white"
                              : "bg-white text-gray-700 hover:bg-gray-200"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="divide-y">
                    {filteredQuestions.map(question => (
                      <button
                        key={question.id}
                        onClick={() => setSelectedQuestion(question)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium text-gray-900 mb-1">
                            {question.question}
                          </p>
                          <p className="text-sm text-gray-500">
                            {question.category}
                          </p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600 rotate-180" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!selectedQuestion && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 text-center">
                  Need more help? Call us at{' '}
                  <a href="tel:678-789-4200" className="text-[#063f48] font-medium hover:underline">
                    678-789-4200
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}