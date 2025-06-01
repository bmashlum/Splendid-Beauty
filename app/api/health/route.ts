import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { checkServiceConfiguration } from '@/lib/env'
import { getCache } from '@/lib/cache'
import { errorLogger } from '@/lib/error-logger'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    filesystem: boolean
    cache: boolean
    environment: boolean
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

async function checkFilesystem(): Promise<boolean> {
  try {
    // Check if we can read/write to data directory
    const dataDir = path.join(process.cwd(), 'data')
    const testFile = path.join(dataDir, '.health-check')
    
    // Try to write a test file
    await fs.writeFile(testFile, new Date().toISOString())
    
    // Try to read it back
    await fs.readFile(testFile, 'utf-8')
    
    // Clean up
    await fs.unlink(testFile)
    
    return true
  } catch (error) {
    console.error('Filesystem check failed:', error)
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
    const [filesystemOk, cacheOk] = await Promise.all([
      checkFilesystem(),
      checkCache()
    ])
    
    const { services } = checkServiceConfiguration()
    const memory = getMemoryUsage()
    
    // Collect any errors
    if (!filesystemOk) errors.push('Filesystem check failed')
    if (!cacheOk) errors.push('Cache check failed')
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