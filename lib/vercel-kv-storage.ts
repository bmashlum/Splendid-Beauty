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
  private kv: any
  private initialized = false
  
  constructor() {
    // Only import kv in production to avoid errors in development
    if (process.env.KV_URL || process.env.KV_REST_API_URL) {
      try {
        const { kv } = require('@vercel/kv') // eslint-disable-line @typescript-eslint/no-require-imports
        this.kv = kv
        console.log('Vercel KV initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Vercel KV:', error)
        // Don't throw - let health check handle the missing KV
      }
    } else {
      console.warn('KV environment variables not found - KV storage will not be available')
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
          } catch (error) {
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
          } catch (error) {
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
      throw new Error('KV storage not available')
    }
    
    try {
      await this.kv.set('blog-posts', posts)
      console.log(`Saved ${posts.length} blog posts to KV`)
    } catch (error) {
      console.error('Error saving blog posts to KV:', error)
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
      console.error('KV not available for health check')
      return false
    }
    
    try {
      const testKey = 'health:check:' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
      const testData = { test: true, timestamp: new Date().toISOString() }
      
      // Write test data
      await this.kv.set(testKey, testData, { ex: 60 }) // Expire after 60 seconds
      
      // Read it back
      const retrieved = await this.kv.get(testKey)
      
      // Clean up
      await this.kv.del(testKey)
      
      return retrieved?.test === true
    } catch (error) {
      console.error('VercelKV health check failed:', error)
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
      this.blogPosts = [testData as any as BlogPost]
      const result = (this.blogPosts[0] as any)?.test === true
      this.blogPosts = tempPosts
      return result
    } catch (error) {
      console.error('InMemoryStorage health check failed:', error)
      return false
    }
  }
}

// Factory function to get the appropriate storage adapter
export function getStorage(): StorageAdapter {
  // Check for KV environment variables first
  if (process.env.KV_URL || process.env.KV_REST_API_URL) {
    console.log('Using Vercel KV storage')
    return new VercelKVStorage()
  }
  
  // In production on Vercel without KV, use in-memory storage
  if (process.env.VERCEL) {
    console.log('Using in-memory storage (data will not persist between deployments)')
    return new InMemoryStorage()
  }
  
  // In development, use file storage
  console.log('Using file storage')
  return new FileStorage()
}

// Singleton instance
let storageInstance: StorageAdapter | null = null

export function getStorageInstance(): StorageAdapter {
  if (!storageInstance) {
    storageInstance = getStorage()
  }
  return storageInstance
}