// Vercel KV client singleton with proper error handling
import { kv } from '@vercel/kv';

let kvClient: typeof import('@vercel/kv').kv | null = null;
let kvClientInitialized = false;

export function getKVClient() {
  if (kvClientInitialized) {
    return kvClient;
  }

  // Check for KV environment variables
  const kvUrl = process.env.KV_URL;
  const kvRestApiUrl = process.env.KV_REST_API_URL;
  const kvRestApiToken = process.env.KV_REST_API_TOKEN;
  const kvRestApiReadOnlyToken = process.env.KV_REST_API_READ_ONLY_TOKEN;

  console.log('[KV] Checking KV configuration:', {
    hasKvUrl: !!kvUrl,
    hasKvRestApiUrl: !!kvRestApiUrl,
    hasKvRestApiToken: !!kvRestApiToken,
    hasKvRestApiReadOnlyToken: !!kvRestApiReadOnlyToken,
    isProduction: process.env.NODE_ENV === 'production',
    isVercel: !!process.env.VERCEL
  });

  // In Vercel environment with any KV env vars, use the default kv export
  if (process.env.VERCEL && (kvUrl || kvRestApiUrl)) {
    try {
      // The @vercel/kv package automatically uses the environment variables
      kvClient = kv;
      kvClientInitialized = true;
      console.log('[KV] Using default Vercel KV client (auto-configured)');
      return kvClient;
    } catch (error) {
      console.error('[KV] Failed to use default KV client:', error);
    }
  }

  // If we're not in Vercel or KV isn't available
  console.error('[KV] No valid KV configuration found. KV storage will not be available.');
  kvClientInitialized = true;
  return null;
}

// Test KV connection
export async function testKVConnection(): Promise<boolean> {
  const client = getKVClient();
  if (!client) {
    console.error('[KV] No KV client available for connection test');
    return false;
  }

  try {
    const testKey = `test:connection:${Date.now()}`;
    const testValue = { test: true, timestamp: new Date().toISOString() };
    
    // Try to set a value
    await client.set(testKey, testValue, { ex: 60 }); // Expire after 60 seconds
    console.log('[KV] Successfully wrote test value');
    
    // Try to read it back
    const retrieved = await client.get(testKey);
    console.log('[KV] Successfully read test value:', retrieved);
    
    // Clean up
    await client.del(testKey);
    console.log('[KV] Successfully deleted test value');
    
    return true;
  } catch (error) {
    console.error('[KV] Connection test failed:', error);
    return false;
  }
}