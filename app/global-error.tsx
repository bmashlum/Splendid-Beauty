'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // This is a fallback error boundary for the root layout
  // It should be minimal and not depend on any components that might fail
  return (
    <html>
      <body style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Critical Error
          </h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            We're experiencing technical difficulties. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}