// Vercel KV Storage adapter for production
// This provides persistent storage for blog posts and events in Vercel's environment

import { BlogPost } from '@/app/api/blog/route'
import { Event } from '@/app/api/events/route'

// Storage interface that can be implemented by different backends
export interface StorageAdapter {
  getBlogPosts(): Promise<BlogPost[]>
  saveBlogPosts(posts: BlogPost[]): Promise<void>
  getEvents(): Promise<Event[]>
  saveEvents(events: Event[]): Promise<void>
  // Health check method to verify storage is working
  healthCheck?(): Promise<boolean>
}

// File-based storage for local development
export class FileStorage implements StorageAdapter {
  private fs = require('fs').promises // eslint-disable-line @typescript-eslint/no-require-imports
  private path = require('path') // eslint-disable-line @typescript-eslint/no-require-imports
  
  private get blogFile() {
    return this.path.join(process.cwd(), 'data', 'blog-posts.json')
  }
  
  private get eventsFile() {
    return this.path.join(process.cwd(), 'data', 'events.json')
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const data = await this.fs.readFile(this.blogFile, 'utf8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    await this.fs.writeFile(this.blogFile, JSON.stringify(posts, null, 2))
  }

  async getEvents(): Promise<Event[]> {
    try {
      const data = await this.fs.readFile(this.eventsFile, 'utf8')
      return JSON.parse(data)
    } catch {
      return []
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    await this.fs.writeFile(this.eventsFile, JSON.stringify(events, null, 2))
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test write to temp file
      const testFile = this.path.join(process.cwd(), 'data', `.health-check-${Date.now()}`)
      await this.fs.writeFile(testFile, JSON.stringify({ test: true }))
      const content = await this.fs.readFile(testFile, 'utf8')
      await this.fs.unlink(testFile)
      return JSON.parse(content).test === true
    } catch (error) {
      console.error('FileStorage health check failed:', error)
      return false
    }
  }
}

// Vercel KV storage for production
export class VercelKVStorage implements StorageAdapter {
  private kv: typeof import('@vercel/kv').kv | null
  private initialized = false
  
  constructor() {
    // Import the kv directly from @vercel/kv
    try {
      const { kv } = require('@vercel/kv') // eslint-disable-line @typescript-eslint/no-require-imports
      this.kv = kv
      console.log('[VercelKVStorage] Using @vercel/kv directly')
    } catch (error) {
      console.error('[VercelKVStorage] Error importing @vercel/kv:', error)
      this.kv = null
    }
  }

  private async initializeData() {
    if (this.initialized || !this.kv) return
    
    try {
      // Check if data exists in KV
      const [blogPosts, events] = await Promise.all([
        this.kv.get('blog-posts'),
        this.kv.get('events')
      ])
      
      // If no data in KV, try to load from JSON files
      if (!blogPosts || !events) {
        console.log('Initializing KV with data from JSON files...')
        const fs = require('fs').promises // eslint-disable-line @typescript-eslint/no-require-imports
        const path = require('path') // eslint-disable-line @typescript-eslint/no-require-imports
        
        if (!blogPosts) {
          try {
            const blogFile = path.join(process.cwd(), 'data', 'blog-posts.json')
            const blogData = await fs.readFile(blogFile, 'utf8')
            await this.kv.set('blog-posts', JSON.parse(blogData))
            console.log('Initialized blog posts in KV')
          } catch {
            console.log('No initial blog posts found')
            await this.kv.set('blog-posts', [])
          }
        }
        
        if (!events) {
          try {
            const eventsFile = path.join(process.cwd(), 'data', 'events.json')
            const eventsData = await fs.readFile(eventsFile, 'utf8')
            await this.kv.set('events', JSON.parse(eventsData))
            console.log('Initialized events in KV')
          } catch {
            console.log('No initial events found')
            await this.kv.set('events', [])
          }
        }
      }
      
      this.initialized = true
    } catch (error) {
      console.error('Error initializing KV data:', error)
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    if (!this.kv) {
      console.warn('KV not available, returning empty array')
      return []
    }
    
    try {
      await this.initializeData()
      const posts = await this.kv.get('blog-posts') as BlogPost[]
      return posts || []
    } catch (error) {
      console.error('Error reading blog posts from KV:', error)
      return []
    }
  }

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    if (!this.kv) {
      console.error('[VercelKVStorage] Cannot save blog posts - KV client not available')
      throw new Error('KV storage not available')
    }
    
    try {
      console.log(`[VercelKVStorage] Attempting to save ${posts.length} blog posts to KV`)
      
      // Save with explicit options
      await this.kv.set('blog-posts', posts)
      
      console.log(`[VercelKVStorage] Successfully executed KV set command`)
      
      // Add a small delay to ensure KV propagation
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Verify the save by reading back
      const verified = await this.kv.get('blog-posts')
      
      if (!verified) {
        console.error('[VercelKVStorage] Verification failed - no data returned from KV')
        throw new Error('Failed to verify blog posts were saved to KV')
      }
      
      const verifiedArray = Array.isArray(verified) ? verified : []
      console.log(`[VercelKVStorage] Verification: saved ${posts.length} posts, retrieved ${verifiedArray.length} posts`)
      
      if (verifiedArray.length !== posts.length) {
        console.warn('[VercelKVStorage] Post count mismatch, retrying save...')
        await this.kv.set('blog-posts', posts)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Verify again
        const secondVerify = await this.kv.get('blog-posts')
        const secondArray = Array.isArray(secondVerify) ? secondVerify : []
        
        if (secondArray.length !== posts.length) {
          console.error(`[VercelKVStorage] Failed to save all posts. Expected: ${posts.length}, Got: ${secondArray.length}`)
          throw new Error('Failed to save all blog posts to KV')
        }
      }
      
      console.log(`[VercelKVStorage] Successfully saved and verified ${posts.length} blog posts`)
    } catch (error) {
      console.error('[VercelKVStorage] Error saving blog posts to KV:', error)
      throw error
    }
  }

  async getEvents(): Promise<Event[]> {
    if (!this.kv) {
      console.warn('KV not available, returning empty array')
      return []
    }
    
    try {
      await this.initializeData()
      const events = await this.kv.get('events') as Event[]
      return events || []
    } catch (error) {
      console.error('Error reading events from KV:', error)
      return []
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    if (!this.kv) {
      throw new Error('KV storage not available')
    }
    
    try {
      await this.kv.set('events', events)
      console.log(`Saved ${events.length} events to KV`)
    } catch (error) {
      console.error('Error saving events to KV:', error)
      throw error
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.kv) {
      console.error('[VercelKVStorage] KV not available for health check')
      return false
    }
    
    try {
      const testKey = `health:${Date.now()}`
      const testValue = { test: true, timestamp: new Date().toISOString() }
      
      // Write test data
      await this.kv.set(testKey, testValue, { ex: 60 })
      
      // Read it back
      const retrieved = await this.kv.get(testKey) as { test: boolean } | null
      
      // Clean up
      await this.kv.del(testKey)
      
      const isHealthy = retrieved?.test === true
      console.log(`[VercelKVStorage] Health check result: ${isHealthy}`)
      return isHealthy
    } catch (error) {
      console.error('[VercelKVStorage] Health check failed:', error)
      return false
    }
  }
}

// In-memory storage as fallback
export class InMemoryStorage implements StorageAdapter {
  private blogPosts: BlogPost[] = []
  private events: Event[] = []
  private initialized = false

  private async initialize() {
    if (this.initialized) return
    
    // Try to load initial data from files if available
    try {
      const fs = require('fs').promises // eslint-disable-line @typescript-eslint/no-require-imports
      const path = require('path') // eslint-disable-line @typescript-eslint/no-require-imports
      
      const blogFile = path.join(process.cwd(), 'data', 'blog-posts.json')
      const eventsFile = path.join(process.cwd(), 'data', 'events.json')
      
      try {
        const blogData = await fs.readFile(blogFile, 'utf8')
        this.blogPosts = JSON.parse(blogData)
      } catch {
        // File doesn't exist, that's okay
      }
      
      try {
        const eventsData = await fs.readFile(eventsFile, 'utf8')
        this.events = JSON.parse(eventsData)
      } catch {
        // File doesn't exist, that's okay
      }
    } catch {
      // fs module not available (browser environment)
    }
    
    this.initialized = true
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    await this.initialize()
    return [...this.blogPosts]
  }

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    await this.initialize()
    this.blogPosts = [...posts]
  }

  async getEvents(): Promise<Event[]> {
    await this.initialize()
    return [...this.events]
  }

  async saveEvents(events: Event[]): Promise<void> {
    await this.initialize()
    this.events = [...events]
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Simple check - can we read and write to memory
      const testData = { test: true }
      const tempPosts = this.blogPosts
      this.blogPosts = [testData as unknown as BlogPost]
      const result = (this.blogPosts[0] as Record<string, unknown>)?.test === true
      this.blogPosts = tempPosts
      return result
    } catch (error) {
      console.error('InMemoryStorage health check failed:', error)
      return false
    }
  }
}

// Factory function to get the appropriate storage adapter
export async function getStorage(): Promise<StorageAdapter> {
  console.log('[Storage] Determining storage adapter...', {
    hasKvUrl: !!process.env.KV_URL,
    hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
    hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
    isVercel: !!process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV
  })
  
  // In production on Vercel, always try KV first
  if (process.env.VERCEL) {
    const kvStorage = new VercelKVStorage()
    
    // Test if KV is actually working
    try {
      const isHealthy = await kvStorage.healthCheck()
      if (isHealthy) {
        console.log('[Storage] ✅ Using Vercel KV storage (verified working)')
        return kvStorage
      } else {
        console.error('[Storage] ❌ KV health check failed, falling back to in-memory storage')
      }
    } catch (error) {
      console.error('[Storage] ❌ KV health check threw error:', error)
    }
    
    // Fallback to in-memory if KV isn't working
    console.warn('[Storage] ⚠️ Using in-memory storage (data will not persist between deployments)')
    console.warn('[Storage] ⚠️ Please ensure KV environment variables are properly configured in Vercel')
    return new InMemoryStorage()
  }
  
  // In development, use file storage
  console.log('[Storage] Using file storage (development mode)')
  return new FileStorage()
}

// Use global to persist storage instance across HMR reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __storageInstance: StorageAdapter | undefined;
}

let storageInitPromise: Promise<StorageAdapter> | null = null

export async function getStorageInstance(): Promise<StorageAdapter> {
  // If we already have an instance, return it
  if (global.__storageInstance) {
    return global.__storageInstance
  }
  
  // If we're already initializing, wait for that to complete
  if (storageInitPromise) {
    return storageInitPromise
  }
  
  // Start initialization
  storageInitPromise = (async () => {
    try {
      const storage = await getStorage()
      global.__storageInstance = storage
      console.log(`[Storage] Created new storage instance: ${storage.constructor.name}`)
      return storage
    } catch (error) {
      console.error('[Storage] Failed to initialize storage:', error)
      // Fallback to in-memory storage
      const fallback = new InMemoryStorage()
      global.__storageInstance = fallback
      return fallback
    }
  })()
  
  return storageInitPromise
}