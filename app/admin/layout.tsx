'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import '../globals.css'
import './globals.css'

// Admin layout with navigation including blog management
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#063f48] text-white shadow-md relative z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold">
              Splendid Beauty Admin
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link 
              href="/admin/events" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/admin/events' ? 'bg-[#0a5561] text-white' : 'text-gray-100 hover:bg-[#0a5561]'
              }`}
            >
              Manage Events
            </Link>
            <Link 
              href="/admin/blog" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/admin/blog' ? 'bg-[#0a5561] text-white' : 'text-gray-100 hover:bg-[#0a5561]'
              }`}
            >
              Manage Blog
            </Link>
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-[#0a5561]"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-[#0a5561]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Splendid Beauty - Admin Dashboard
        </div>
      </footer>
    </div>
  )
}