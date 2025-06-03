// Redis storage adapter for direct Redis connections
import { BlogPost } from '@/app/api/blog/route'
import { Event } from '@/app/api/events/route'
import { StorageAdapter } from './vercel-kv-storage'
import { getRedisClient, testRedisConnection } from './redis-client'

export class RedisStorageAdapter implements StorageAdapter {
  private initialized = false

  private async ensureInitialized() {
    if (this.initialized) return;
    
    const client = await getRedisClient();
    if (!client) {
      throw new Error('Redis client not available');
    }
    
    // Check if data exists, if not initialize
    try {
      const blogPosts = await client.get('blog-posts');
      if (!blogPosts) {
        console.log('[RedisStorage] Initializing blog posts');
        await client.set('blog-posts', JSON.stringify([]));
      }
      
      const events = await client.get('events');
      if (!events) {
        console.log('[RedisStorage] Initializing events');
        await client.set('events', JSON.stringify([]));
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('[RedisStorage] Initialization error:', error);
      throw error;
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      await this.ensureInitialized();
      const client = await getRedisClient();
      if (!client) {
        console.error('[RedisStorage] No Redis client available');
        return [];
      }
      
      const data = await client.get('blog-posts');
      if (!data) return [];
      
      return JSON.parse(data) as BlogPost[];
    } catch (error) {
      console.error('[RedisStorage] Error getting blog posts:', error);
      return [];
    }
  }

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    try {
      await this.ensureInitialized();
      const client = await getRedisClient();
      if (!client) {
        throw new Error('Redis client not available');
      }
      
      await client.set('blog-posts', JSON.stringify(posts));
      console.log(`[RedisStorage] Saved ${posts.length} blog posts`);
      
      // Verify save
      const verification = await client.get('blog-posts');
      if (!verification) {
        throw new Error('Failed to verify blog posts were saved');
      }
      
      const verifiedPosts = JSON.parse(verification) as BlogPost[];
      if (verifiedPosts.length !== posts.length) {
        throw new Error(`Save verification failed. Expected ${posts.length}, got ${verifiedPosts.length}`);
      }
    } catch (error) {
      console.error('[RedisStorage] Error saving blog posts:', error);
      throw error;
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      await this.ensureInitialized();
      const client = await getRedisClient();
      if (!client) {
        console.error('[RedisStorage] No Redis client available');
        return [];
      }
      
      const data = await client.get('events');
      if (!data) return [];
      
      return JSON.parse(data) as Event[];
    } catch (error) {
      console.error('[RedisStorage] Error getting events:', error);
      return [];
    }
  }

  async saveEvents(events: Event[]): Promise<void> {
    try {
      await this.ensureInitialized();
      const client = await getRedisClient();
      if (!client) {
        throw new Error('Redis client not available');
      }
      
      await client.set('events', JSON.stringify(events));
      console.log(`[RedisStorage] Saved ${events.length} events`);
      
      // Verify save
      const verification = await client.get('events');
      if (!verification) {
        throw new Error('Failed to verify events were saved');
      }
      
      const verifiedEvents = JSON.parse(verification) as Event[];
      if (verifiedEvents.length !== events.length) {
        throw new Error(`Save verification failed. Expected ${events.length}, got ${verifiedEvents.length}`);
      }
    } catch (error) {
      console.error('[RedisStorage] Error saving events:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const isConnected = await testRedisConnection();
      console.log(`[RedisStorage] Health check: ${isConnected ? 'healthy' : 'unhealthy'}`);
      return isConnected;
    } catch (error) {
      console.error('[RedisStorage] Health check failed:', error);
      return false;
    }
  }
}