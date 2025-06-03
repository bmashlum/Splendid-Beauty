// Redis client for direct Redis connection
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let connectionPromise: Promise<ReturnType<typeof createClient> | null> | null = null;

export async function getRedisClient() {
  if (redisClient && redisClient.isReady) {
    return redisClient;
  }

  // If we're already connecting, wait for that connection
  if (connectionPromise) {
    await connectionPromise;
    return redisClient;
  }

  // Get Redis URL from environment
  const redisUrl = process.env.REDIS_URL || process.env.KV_URL || process.env.REDIS_CONNECTION_STRING;
  
  if (!redisUrl) {
    console.error('[Redis] No Redis URL found in environment variables');
    return null;
  }

  console.log('[Redis] Connecting to Redis...');
  
  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.error('[Redis] Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    // Set up error handling
    redisClient.on('error', (err) => {
      console.error('[Redis] Client error:', err);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Client ready');
    });

    // Connect to Redis
    connectionPromise = (async () => {
      await redisClient!.connect();
      return redisClient;
    })();
    
    const client = await connectionPromise;
    console.log('[Redis] Connection established');
    return client;
  } catch (error) {
    console.error('[Redis] Failed to connect:', error);
    redisClient = null;
    connectionPromise = null;
    return null;
  }
}

// Test Redis connection
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    const testKey = `test:${Date.now()}`;
    const testValue = 'hello';
    
    // Test set
    await client.set(testKey, testValue, { EX: 10 });
    
    // Test get
    const retrieved = await client.get(testKey);
    
    // Test delete
    await client.del(testKey);
    
    return retrieved === testValue;
  } catch (error) {
    console.error('[Redis] Connection test failed:', error);
    return false;
  }
}

// Disconnect Redis (for cleanup)
export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    connectionPromise = null;
  }
}