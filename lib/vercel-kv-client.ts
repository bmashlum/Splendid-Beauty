// Vercel KV client singleton with proper error handling
import { createClient } from '@vercel/kv';

let kvClient: any = null;

export function getKVClient() {
  if (kvClient) {
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

  // Try to create KV client if we have the necessary environment variables
  if (kvRestApiUrl && kvRestApiToken) {
    try {
      kvClient = createClient({
        url: kvRestApiUrl,
        token: kvRestApiToken,
      });
      console.log('[KV] Successfully created KV client with REST API credentials');
      return kvClient;
    } catch (error) {
      console.error('[KV] Failed to create KV client with REST API:', error);
    }
  }

  // Fallback to default KV client (uses KV_URL and other env vars automatically)
  if (kvUrl) {
    try {
      kvClient = createClient({
        url: kvUrl,
        token: kvRestApiToken || kvRestApiReadOnlyToken || '',
      });
      console.log('[KV] Successfully created KV client with KV_URL');
      return kvClient;
    } catch (error) {
      console.error('[KV] Failed to create KV client with KV_URL:', error);
    }
  }

  console.error('[KV] No valid KV configuration found. KV storage will not be available.');
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