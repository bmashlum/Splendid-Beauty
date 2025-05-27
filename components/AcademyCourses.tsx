'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  name: string
  imagePath: string
}

const courses: Course[] = [
  { id: 'course_1', name: 'Powder Brow Shading', imagePath: '/images/course_1.webp' },
  { id: 'course_2', name: 'Nano Strokes', imagePath: '/images/course_2.webp' },
  { id: 'course_3', name: 'Microblading', imagePath: '/images/course_3.webp' },
  { id: 'course_4', name: 'Lip Blush', imagePath: '/images/course_4.webp' },
  { id: 'course_5', name: 'Light Cured Lash Extensions', imagePath: '/images/course_5.webp' },
  { id: 'course_6', name: 'Lift & Laminate', imagePath: '/images/course_6.webp' },
]

export default function AcademyCourses() {
  const [showCourses, setShowCourses] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  const handleImageLoad = (courseId: string) => {
    setLoadedImages(prev => new Set(prev).add(courseId))
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowCourses(!showCourses)}
          className={cn(
            "group relative px-8 py-4 bg-[#063f48] text-white font-semibold rounded-full",
            "shadow-lg transition-all duration-300 transform",
            "hover:scale-105 hover:shadow-xl hover:bg-[#05535e]",
            "focus:outline-none focus:ring-4 focus:ring-[#063f48]/20",
            showCourses && "bg-[#05535e] shadow-xl"
          )}
          aria-label={showCourses ? "Hide training courses" : "View training courses"}
        >
          <span className="flex items-center gap-3">
            <svg
              className={cn(
                "w-5 h-5 transition-transform duration-300",
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
            {showCourses ? 'Hide Training Courses' : 'View Training Courses'}
            <svg
              className="w-5 h-5"
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
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-2xl"
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
                  <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enlarged Course View Overlay */}
      <AnimatePresence>
        {hoveredCourse && showCourses && (
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
    </div>
  )
}