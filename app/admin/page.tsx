'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation' // Correct import for App Router client components

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // After successful login and navigation to /admin,
    // this page immediately redirects to the default admin section.
    router.replace('/admin/events'); // Use replace to avoid adding /admin to history
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="animate-pulse text-gray-600">
        <p className="text-lg font-medium">Loading Admin Dashboard...</p>
        <p className="text-sm">Redirecting to your workspace.</p>
      </div>
      {/* Basic spinner as a visual cue */}
      <div className="mt-4 h-8 w-8 border-4 border-t-transparent border-[#063f48] rounded-full animate-spin"></div>
    </div>
  );
}