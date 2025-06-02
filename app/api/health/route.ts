import { NextResponse } from 'next/server'
import { checkServiceConfiguration } from '@/lib/env'
import { getCache } from '@/lib/cache'
import { errorLogger } from '@/lib/error-logger'
import { getStorageInstance } from '@/lib/vercel-kv-storage'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    filesystem: boolean
    cache: boolean
    environment: boolean
    storage: boolean
    memory: {
      used: number
      limit: number
      percentage: number
    }
  }
  services: {
    auth: boolean
    analytics: boolean
    maps: boolean
  }
  errors?: string[]
}

async function checkWriteCapability(): Promise<boolean> {
  try {
    const storage = getStorageInstance()
    
    // Use the storage adapter's health check method if available
    if (storage.healthCheck) {
      return await storage.healthCheck()
    }
    
    // Fallback: try basic read operations
    try {
      await storage.getBlogPosts()
      await storage.getEvents()
      return true
    } catch (error) {
      console.error('Storage read test failed:', error)
      return false
    }
  } catch (error) {
    console.error('Write capability check failed:', error)
    return false
  }
}

async function checkCache(): Promise<boolean> {
  try {
    const cache = getCache()
    const testKey = 'health-check-test'
    const testValue = { test: true, timestamp: Date.now() }
    
    // Test set
    await cache.set(testKey, testValue, 10)
    
    // Test get
    const retrieved = await cache.get(testKey)
    
    // Test delete
    await cache.delete(testKey)
    
    return retrieved !== null
  } catch (error) {
    console.error('Cache check failed:', error)
    return false
  }
}

async function checkStorage(): Promise<boolean> {
  try {
    const storage = getStorageInstance()
    
    // Test reading (should work even if empty)
    await storage.getBlogPosts()
    await storage.getEvents()
    
    return true
  } catch (error) {
    console.error('Storage check failed:', error)
    return false
  }
}

function getMemoryUsage() {
  const used = process.memoryUsage()
  const limit = 512 * 1024 * 1024 // 512MB default for Node.js
  
  return {
    used: Math.round(used.heapUsed / 1024 / 1024), // MB
    limit: Math.round(limit / 1024 / 1024), // MB
    percentage: Math.round((used.heapUsed / limit) * 100)
  }
}

export async function GET() {
  const errors: string[] = []
  
  try {
    // Run health checks
    const [filesystemOk, cacheOk, storageOk] = await Promise.all([
      checkWriteCapability(),
      checkCache(),
      checkStorage()
    ])
    
    const { services } = checkServiceConfiguration()
    const memory = getMemoryUsage()
    
    // Collect any errors with more descriptive messages
    if (!filesystemOk) {
      const env = process.env.VERCEL ? 'Vercel' : process.env.NETLIFY ? 'Netlify' : 'server'
      const isProduction = process.env.NODE_ENV === 'production'
      if (isProduction || env !== 'server') {
        errors.push(`Storage write test failed - Check Vercel KV configuration in dashboard`)
      } else {
        errors.push(`Storage write test failed - Check filesystem permissions`)
      }
    }
    if (!cacheOk) errors.push('Cache check failed')
    if (!storageOk) errors.push('Storage check failed')
    if (!services.auth) errors.push('Auth not properly configured')
    if (memory.percentage > 90) errors.push('High memory usage')
    
    // Get recent errors from error logger
    const recentErrors = errorLogger.getRecentErrors(5)
    if (recentErrors.length > 0) {
      errors.push(`${recentErrors.length} recent application errors`)
    }
    
    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (errors.length > 0) {
      status = errors.length > 2 ? 'unhealthy' : 'degraded'
    }
    
    const healthCheck: HealthCheck = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        filesystem: filesystemOk,
        cache: cacheOk,
        environment: services.auth,
        storage: storageOk,
        memory
      },
      services,
      ...(errors.length > 0 && { errors })
    }
    
    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503
    
    return NextResponse.json(healthCheck, { status: statusCode })
    
  } catch (error) {
    // Critical error in health check itself
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        uptime: process.uptime()
      },
      { status: 503 }
    )
  }
}

// Optional: Add a simple HTML view for browser access
export async function HEAD() {
  // Simple HEAD request for uptime monitoring
  return new NextResponse(null, { status: 200 })
}