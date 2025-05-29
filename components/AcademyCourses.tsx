'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  name: string
  imagePath: string
  duration: string
  price: string
  enrollmentFee: string
  instructor: string
  description: string
  highlights: string[]
  included: string[]
}

const courses: Course[] = [
  { 
    id: 'course_1', 
    name: 'Powder Brow Shading', 
    imagePath: '/images/course_1.webp',
    duration: '3 Day Training Course',
    price: '$3,000',
    enrollmentFee: '$750',
    instructor: 'Eden Y., Award-Winning Master PMU Artist & Instructor',
    description: 'Transform your passion into a career by becoming a certified permanent makeup artist. Master the art of creating soft, powdered brows with this highly sought-after technique.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Intensive, hands-on training',
      'Practice on live models',
      'Master a variety of styles',
      'Brow mapping & color theory'
    ],
    included: [
      'Comprehensive starter kit (15+ services)',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
  { 
    id: 'course_2', 
    name: 'Nano Strokes', 
    imagePath: '/images/course_2.webp',
    duration: '4 Day Training Course',
    price: '$3,500',
    enrollmentFee: '$750',
    instructor: 'Eden Y., Award-Winning Master PMU Artist & Instructor',
    description: 'Learn the most advanced technique in permanent makeup. Create ultra-realistic, hair-like strokes that are indistinguishable from natural brow hairs.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Intensive, hands-on training',
      'Practice on live models',
      'Expert application techniques',
      'Ergonomic training'
    ],
    included: [
      'Comprehensive starter kit (15+ services)',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
  { 
    id: 'course_3', 
    name: 'Microblading', 
    imagePath: '/images/course_3.webp',
    duration: '4 Day Training Course',
    price: '$3,500',
    enrollmentFee: '$750',
    instructor: 'Eden Y., Award-Winning Master PMU Artist & Instructor',
    description: 'Master the art of creating natural, hair-like strokes to enhance brows. Be among the top professionals offering flawless, semi-permanent brow transformations.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Intensive, hands-on training',
      'Practice on live models',
      'Master a variety of styles',
      'Brow mapping & color theory'
    ],
    included: [
      'Comprehensive starter kit (15+ services)',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
  { 
    id: 'course_4', 
    name: 'Lip Blush', 
    imagePath: '/images/course_4.webp',
    duration: '3 Day Training Course',
    price: '$3,000',
    enrollmentFee: '$750',
    instructor: 'Eden Y., Award-Winning Master PMU Artist & Instructor',
    description: 'Learn to create beautiful, natural-looking lip color that enhances your clients\' features. Master cutting-edge lip blush techniques for stunning results.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Intensive, hands-on training',
      'Practice on live models',
      'Learn cutting-edge modalities',
      'Expert application techniques'
    ],
    included: [
      'Comprehensive starter kit (15+ services)',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
  { 
    id: 'course_5', 
    name: 'Light Cured Lash Extensions', 
    imagePath: '/images/course_5.webp',
    duration: '3 Day Training Course',
    price: '$2,000',
    enrollmentFee: '$650',
    instructor: 'Christine E., Award-Winning Master Lash Artist & Instructor',
    description: 'Master the revolutionary light-cured lash extension technique. Offer your clients longer-lasting, more comfortable lash extensions with this cutting-edge technology.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Intensive, hands-on training',
      'Practice on live models',
      'Learn cutting-edge modalities',
      'Ergonomic training'
    ],
    included: [
      'UV/LED Lamp & supplies (15+ services)',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
  { 
    id: 'course_6', 
    name: 'Lift & Laminate', 
    imagePath: '/images/course_6.webp',
    duration: '1 Day Training Course',
    price: '$650',
    enrollmentFee: '$250',
    instructor: 'Christine E., Award-Winning Master Lash Artist & Instructor',
    description: 'Learn eyelash lift & tint and brow lamination & tint in one comprehensive course. Optimize your income with simultaneous service training.',
    highlights: [
      'No prior experience needed',
      'Small, personalized class sizes',
      'Eye & skin anatomy training',
      'Practice on live models',
      'Simultaneous service training',
      'Expert application techniques'
    ],
    included: [
      'Supplies for 15+ services',
      'Exclusive course manual by SBBCo',
      'Cross-contamination training',
      'Ongoing post-class support',
      'Social media strategies',
      'Certificate of completion'
    ]
  },
]

export default function AcademyCourses() {
  const [showCourses, setShowCourses] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const [selectedMobileCourse, setSelectedMobileCourse] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Lock body scroll when mobile course modal is open
  useEffect(() => {
    if (selectedMobileCourse && isMobile) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [selectedMobileCourse, isMobile])

  const handleImageLoad = (courseId: string) => {
    setLoadedImages(prev => new Set(prev).add(courseId))
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-2">
        <button
          onClick={() => setShowCourses(!showCourses)}
          className={cn(
            "group relative px-4 py-2 text-xs bg-[#063f48] text-white font-medium rounded-full",
            "shadow-md transition-all duration-300 transform",
            "hover:scale-105 hover:shadow-lg hover:bg-[#05535e]",
            "focus:outline-none focus:ring-2 focus:ring-[#063f48]/20",
            showCourses && "bg-[#05535e] shadow-lg"
          )}
          aria-label={showCourses ? "Hide training courses" : "View training courses"}
        >
          <span className="flex items-center gap-1.5">
            <svg
              className={cn(
                "w-3 h-3 transition-transform duration-300",
                showCourses && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {showCourses ? 'Hide Courses' : 'View Courses'}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showCourses && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {/* Desktop View - unchanged */}
            <motion.div
              className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="relative aspect-[4/3] group cursor-pointer"
                  onMouseEnter={() => setHoveredCourse(course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    {!loadedImages.has(course.id) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <Image
                      src={course.imagePath}
                      alt={`Training ${course.name}`}
                      fill
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        loadedImages.has(course.id) ? "opacity-100" : "opacity-0"
                      )}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      onLoad={() => handleImageLoad(course.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-medium uppercase tracking-wider">
                        {course.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile View - new carousel style */}
            <div className="sm:hidden">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-3" style={{ width: 'max-content' }}>
                    {courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="w-[280px] flex-shrink-0"
                        onClick={() => setSelectedMobileCourse(course.id)}
                      >
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                          {!loadedImages.has(course.id) && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                          <Image
                            src={course.imagePath}
                            alt={`Training ${course.name}`}
                            fill
                            className={cn(
                              "object-cover transition-opacity duration-300",
                              loadedImages.has(course.id) ? "opacity-100" : "opacity-0"
                            )}
                            sizes="280px"
                            onLoad={() => handleImageLoad(course.id)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <p className="text-sm font-medium uppercase tracking-wider">
                              {course.name}
                            </p>
                            <p className="text-xs opacity-80 mt-1">Tap to view</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-3">
                  <p className="text-sm font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
                    Swipe to see more courses →
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Enlarged Course View Overlay - unchanged */}
      <AnimatePresence>
        {hoveredCourse && showCourses && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full h-full max-w-[90vw] max-h-[85vh] pointer-events-auto"
              onMouseEnter={() => setHoveredCourse(hoveredCourse)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-black">
                <Image
                  src={courses.find(c => c.id === hoveredCourse)?.imagePath || ''}
                  alt={`Training ${courses.find(c => c.id === hoveredCourse)?.name || ''} - Enlarged View`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-white text-2xl font-bold uppercase tracking-wider">
                    {courses.find(c => c.id === hoveredCourse)?.name || ''}
                  </h3>
                  <p className="text-white/80 text-sm mt-2">
                    Hover outside to return to course gallery
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Fullscreen View */}
      <AnimatePresence>
        {selectedMobileCourse && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-white overflow-y-auto"
          >
            {/* Fixed close button - positioned to avoid navbar */}
            <button
              className="fixed top-20 right-4 z-[10001] p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedMobileCourse(null)}
              aria-label="Close course details"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Header */}
            <div className="sticky top-0 z-[10000] bg-white border-b border-gray-200 pt-16 pb-4">
              <div className="px-4">
                <h2 className="text-lg font-bold text-[#063f48] text-center">Course Details</h2>
              </div>
            </div>
            
            {(() => {
              const course = courses.find(c => c.id === selectedMobileCourse);
              if (!course) return null;
              
              return (
                <>
                  {/* Course Image */}
                  <div className="relative w-full h-64 bg-gray-100">
                    <Image
                      src={course.imagePath}
                      alt={`Training ${course.name}`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  </div>
                  
                  {/* Course Content */}
                  <div className="p-6 space-y-6">
                    {/* Title and Price */}
                    <div>
                      <h1 className="text-2xl font-bold text-[#063f48] mb-2">{course.name}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.price} total
                        </span>
                      </div>
                    </div>
                    
                    {/* Instructor */}
                    <div className="bg-[#063f48]/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Taught by</p>
                      <p className="font-medium text-[#063f48]">{course.instructor}</p>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-[#063f48] mb-2">About this course</h3>
                      <p className="text-gray-700 leading-relaxed">{course.description}</p>
                    </div>
                    
                    {/* Highlights */}
                    <div>
                      <h3 className="font-semibold text-[#063f48] mb-3">Course Highlights</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {course.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* What's Included */}
                    <div>
                      <h3 className="font-semibold text-[#063f48] mb-3">What's Included</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {course.included.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-[#063f48] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Enrollment Info */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">Enrollment fee:</span> {course.enrollmentFee} to secure your spot
                      </p>
                    </div>
                    
                    {/* Awards Badge */}
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 font-medium">
                        ⭐ Voted Best of Georgia 2024 ⭐
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Georgia Business Journal</p>
                    </div>
                  </div>
                  
                  {/* Sticky CTA Button */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-[10000]">
                    <a
                      href="tel:678-769-4200"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-[#063f48] text-white font-semibold rounded-full shadow-lg hover:bg-[#05535e] transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now to Enroll: 678-769-4200
                    </a>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      1-on-1 training available by request
                    </p>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}