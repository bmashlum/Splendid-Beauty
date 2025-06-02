'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Track Core Web Vitals specifically
    const vitals = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'INP']
    if (vitals.includes(metric.name)) {
      // Log poor performance metrics
      const thresholds: Record<string, number> = {
        FCP: 1800, // First Contentful Paint
        LCP: 2500, // Largest Contentful Paint
        CLS: 0.1,  // Cumulative Layout Shift
        FID: 100,  // First Input Delay
        TTFB: 800, // Time to First Byte
        INP: 200   // Interaction to Next Paint
      }

      if (metric.value > thresholds[metric.name]) {
        console.log(`Poor ${metric.name} performance:`, metric.value)
        
        // You could send this to your error logger
        if (typeof window !== 'undefined') {
          const event = new Error(`Poor ${metric.name} performance: ${metric.value}`)
          // Import dynamically to avoid circular dependencies
          import('@/lib/error-logger').then(({ logError }) => {
            logError(event, 'warning')
          })
        }
      }
    }
  })

  return null
}