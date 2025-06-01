'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logError } from '@/lib/error-logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error using our error logger
    logError(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Our team has been notified and is working on fixing this issue.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={reset}
            className="bg-primary hover:bg-primary/90"
          >
            Try again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}