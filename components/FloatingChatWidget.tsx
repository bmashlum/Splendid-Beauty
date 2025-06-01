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
    answer: 'You can book your appointment by clicking the "Book Now" buttons throughout our website, or call/text us at 678-789-4200. We use Boulevard for online booking which allows you to select your service, preferred professional, and time slot.'
  },
  {
    id: '2',
    category: 'Booking',
    question: 'What is your cancellation policy?',
    answer: 'We require 24-hour notice for appointment cancellations. Late cancellations or no-shows may result in a fee. Please review our complete policies on the Policies page for more details.'
  },
  
  // Services
  {
    id: '3',
    category: 'Services',
    question: 'What services do you offer?',
    answer: 'We offer luxury beauty services including: Cosmetic & Paramedical Tattooing (microblading, nano strokes, areola reconstruction), Facials & Esthetics, Eyelash Extensions & Lifts, Body Grooming, Spray Tanning, and more. We\'re also expanding to include filler, injections, and hormone therapy soon!'
  },
  {
    id: '4',
    category: 'Services',
    question: 'What is permanent makeup?',
    answer: 'Permanent makeup includes microblading, nano strokes, lip blush, and lash line enhancement. These are cosmetic tattoo techniques that create natural-looking enhancements. Results typically last 1-3 years depending on skin type and aftercare.'
  },
  {
    id: '5',
    category: 'Services',
    question: 'Do you offer medical tattooing?',
    answer: 'Yes! We offer paramedical tattooing including areola reconstruction, scar revision, stretch mark camouflage, scalp micropigmentation, and beauty marks. These services help restore confidence after medical procedures or injuries.'
  },
  {
    id: '6',
    category: 'Services',
    question: 'What facial treatments are available?',
    answer: 'We offer various facials including hydrating, anti-aging, acne treatments, chemical peels, dermaplaning, and customized treatments for your specific skin concerns. Each facial is tailored to improve fine lines, wrinkles, texture, and overall skin health.'
  },
  {
    id: '7',
    category: 'Services',
    question: 'What eyelash services do you provide?',
    answer: 'We offer lash lifts with tinting, classic and volume eyelash extensions, and maintenance services. Lash lifts last 6-8 weeks, while extensions require fills every 2-3 weeks for best results.'
  },
  
  // Pricing & Payment
  {
    id: '8',
    category: 'Pricing',
    question: 'Do you offer financing?',
    answer: 'Yes! We partner with Cherry Financing to offer flexible payment plans. You can apply risk-free with no impact to your credit score. Click the "Financing" section on our website to learn more and apply.'
  },
  {
    id: '9',
    category: 'Pricing',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit cards, and Cherry Financing. Payment is due at the time of service. Gift certificates are also available for purchase.'
  },
  {
    id: '10',
    category: 'Pricing',
    question: 'Can I buy a gift certificate?',
    answer: 'Yes! Gift certificates make perfect gifts. You can purchase them online through our booking system or in-person at our studio. They can be used for any service we offer.'
  },
  
  // Location & Contact
  {
    id: '11',
    category: 'Contact',
    question: 'Where are you located?',
    answer: 'We\'re located at 104 Covington St. Loganville, GA 30052. You can find us easily using the map on our Connect section, and there\'s convenient parking available.'
  },
  {
    id: '12',
    category: 'Contact',
    question: 'What are your hours?',
    answer: 'Our hours vary by service and professional. When booking online, you\'ll see all available time slots. You can also call/text 678-789-4200 to inquire about specific availability.'
  },
  {
    id: '13',
    category: 'Contact',
    question: 'How can I contact you?',
    answer: 'You can reach us by: Phone/Text: 678-789-4200, Email: Service@SplendidBeautyBar.co, or through our social media @SplendidBeautyBarAndCo on Instagram and Facebook.'
  },
  
  // Academy & Training
  {
    id: '14',
    category: 'Academy',
    question: 'Do you offer beauty training?',
    answer: 'Yes! Splendid Beauty Academy offers professional training and apprenticeships. We provide certificates of completion and hands-on training. Courses start at $200. Text 678-789-4200 for more information about our current programs.'
  },
  
  // Hair Studio
  {
    id: '15',
    category: 'Hair Studio',
    question: 'Do you rent booth space?',
    answer: 'Yes! Our Hair Studio offers booth rental opportunities for beauty professionals. Build your beauty empire with us - we provide the space, you bring your business. Contact us to learn about availability and rates.'
  },
  
  // Policies
  {
    id: '16',
    category: 'Policies',
    question: 'Are you inclusive of all clients?',
    answer: 'Absolutely! We believe "Beauty for Everybody" and maintain a strict non-discrimination policy. Everyone deserves to feel beautiful, and we welcome all clients regardless of background, identity, or ability.'
  },
  {
    id: '17',
    category: 'Policies',
    question: 'What safety measures do you have?',
    answer: 'Your safety is our priority. We maintain strict sanitation protocols, use single-use items when appropriate, and follow all health department regulations. Our studio guidelines ensure a safe, clean environment for all clients.'
  },
  
  // General
  {
    id: '18',
    category: 'General',
    question: 'Who are the founders?',
    answer: 'Splendid Beauty Bar was founded by Christine Eaton and Eden York, who believe in making luxury beauty services accessible to everyone. They\'ve created a welcoming space where "Beauty for Everybody" is more than a motto - it\'s our mission.'
  },
  {
    id: '19',
    category: 'General',
    question: 'Can I see examples of your work?',
    answer: 'Yes! Visit our Portfolio section or follow us @SplendidBeautyBarAndCo on Instagram and Facebook to see our latest work, client transformations, and updates.'
  },
  {
    id: '20',
    category: 'General',
    question: 'Do you sell beauty products?',
    answer: 'Yes! We have an online shop featuring the products we actually use and that our clients always ask about. Visit our Shop section or Linktree for our curated collection of professional beauty products.'
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