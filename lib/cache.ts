import { promises as fs } from 'fs'
import path from 'path'

interface CacheEntry<T> {
  value: T
  expires: number
  createdAt: number
}

class PersistentCache {
  private memoryCache: Map<string, CacheEntry<unknown>> = new Map()
  private cacheDir: string
  private saveInterval: NodeJS.Timeout | null = null

  constructor() {
    // Vercel provides /tmp for temporary storage (up to 512MB)
    // In production on Vercel, use /tmp which persists during the function lifecycle
    this.cacheDir = process.env.VERCEL 
      ? '/tmp/splendid-cache'
      : path.join(process.cwd(), '.cache')
    
    this.initializeCache()
  }

  private async initializeCache() {
    try {
      // Create cache directory if it doesn't exist
      await fs.mkdir(this.cacheDir, { recursive: true })
      
      // Load existing cache files
      const files = await fs.readdir(this.cacheDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = await fs.readFile(path.join(this.cacheDir, file), 'utf-8')
            const data = JSON.parse(content)
            const key = file.replace('.json', '')
            
            // Check if cache entry is still valid
            if (data.expires > Date.now()) {
              this.memoryCache.set(key, data)
            } else {
              // Clean up expired cache file
              await this.deleteFile(key)
            }
          } catch (error) {
            console.error(`Failed to load cache file ${file}:`, error)
          }
        }
      }

      // Save cache to disk periodically (every 5 minutes)
      this.saveInterval = setInterval(() => {
        this.saveToDisk()
      }, 5 * 60 * 1000)

    } catch (error) {
      console.error('Failed to initialize cache:', error)
    }
  }

  private sanitizeKey(key: string): string {
    // Replace invalid filename characters
    return key.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  private async saveToDisk() {
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires > Date.now()) {
        try {
          const filename = `${this.sanitizeKey(key)}.json`
          await fs.writeFile(
            path.join(this.cacheDir, filename),
            JSON.stringify(entry),
            'utf-8'
          )
        } catch (error) {
          console.error(`Failed to save cache entry ${key}:`, error)
        }
      }
    }
  }

  private async deleteFile(key: string) {
    try {
      const filename = `${this.sanitizeKey(key)}.json`
      await fs.unlink(path.join(this.cacheDir, filename))
    } catch {
      // Ignore file not found errors
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryCache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if expired
    if (entry.expires <= Date.now()) {
      this.memoryCache.delete(key)
      await this.deleteFile(key)
      return null
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      expires: Date.now() + (ttlSeconds * 1000),
      createdAt: Date.now()
    }

    this.memoryCache.set(key, entry)
    
    // Save to disk immediately for important data
    if (ttlSeconds > 300) { // Only persist cache entries with TTL > 5 minutes
      try {
        const filename = `${this.sanitizeKey(key)}.json`
        await fs.writeFile(
          path.join(this.cacheDir, filename),
          JSON.stringify(entry),
          'utf-8'
        )
      } catch (error) {
        console.error(`Failed to persist cache entry ${key}:`, error)
      }
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key)
    await this.deleteFile(key)
  }

  async clear(): Promise<void> {
    this.memoryCache.clear()
    
    try {
      const files = await fs.readdir(this.cacheDir)
      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(this.cacheDir, file))
        }
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  // Get cache statistics
  getStats() {
    const entries = Array.from(this.memoryCache.entries())
    const validEntries = entries.filter(([_, entry]) => entry.expires > Date.now())
    const totalSize = JSON.stringify(entries).length

    return {
      entries: validEntries.length,
      approximateSizeBytes: totalSize,
      oldestEntry: Math.min(...validEntries.map(([_, e]) => e.createdAt)),
      newestEntry: Math.max(...validEntries.map(([_, e]) => e.createdAt))
    }
  }

  // Cleanup method to be called on server shutdown
  cleanup() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval)
      this.saveToDisk() // Final save
    }
  }
}

// Create singleton instance
let cacheInstance: PersistentCache | null = null

export function getCache(): PersistentCache {
  if (!cacheInstance) {
    cacheInstance = new PersistentCache()
  }
  return cacheInstance
}

// Helper functions for common cache operations
export async function getCached<T>(
  key: string, 
  fetcher: () => Promise<T>, 
  ttlSeconds: number = 3600
): Promise<T> {
  const cache = getCache()
  
  // Try to get from cache
  const cached = await cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const fresh = await fetcher()
  
  // Store in cache
  await cache.set(key, fresh, ttlSeconds)
  
  return fresh
}

// Cleanup on process exit
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    const cache = getCache()
    cache.cleanup()
  })
}