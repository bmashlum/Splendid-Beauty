// Simple error logging system that can be replaced with Sentry or other services
// For production, errors are logged to a file that can be monitored

interface ErrorLog {
  message: string
  stack?: string
  digest?: string
  timestamp: string
  url?: string
  userAgent?: string
  type: 'error' | 'warning' | 'info'
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 1000 // Keep last 1000 errors in memory

  log(error: Error & { digest?: string }, type: 'error' | 'warning' | 'info' = 'error') {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      type
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error logged: ${errorLog.message}`, errorLog)
    }

    // Store in memory (in production, you'd send this to a logging service)
    this.logs.push(errorLog)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // Remove oldest log
    }

    // In production, you could send this to:
    // 1. A free service like LogRocket (free tier available)
    // 2. Your own API endpoint that writes to a log file
    // 3. Google Analytics events (free)
    // 4. Vercel Analytics (if hosting on Vercel)
    
    // Example: Send to Google Analytics as an event
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag('event', 'exception', {
        description: error.message,
        fatal: type === 'error'
      })
    }
  }

  // Get recent errors (useful for admin dashboard)
  getRecentErrors(limit = 50): ErrorLog[] {
    return this.logs.slice(-limit).reverse()
  }

  // Clear error logs
  clearLogs() {
    this.logs = []
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger()

// Helper function to log errors
export function logError(error: Error & { digest?: string }, type: 'error' | 'warning' | 'info' = 'error') {
  errorLogger.log(error, type)
}