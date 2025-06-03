import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    environment: {
      isVercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV,
      hasKvUrl: !!process.env.KV_URL,
      hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
      hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
    },
    tests: {}
  }

  // Test 1: Direct KV operations
  try {
    console.log('[KV-Debug] Testing direct KV operations...')
    
    // Set a test value
    const testKey = 'debug-test'
    const testValue = { message: 'Hello from KV', time: Date.now() }
    await kv.set(testKey, testValue)
    debug.tests.set = 'success'
    
    // Get the value back
    const retrieved = await kv.get(testKey)
    debug.tests.get = retrieved ? 'success' : 'failed'
    debug.tests.retrievedValue = retrieved
    
    // Delete the test key
    await kv.del(testKey)
    debug.tests.del = 'success'
    
    debug.kvWorking = true
  } catch (error) {
    debug.kvWorking = false
    debug.kvError = error instanceof Error ? error.message : 'Unknown error'
    console.error('[KV-Debug] Direct KV test failed:', error)
  }

  // Test 2: Blog posts operations
  try {
    console.log('[KV-Debug] Testing blog posts...')
    
    // Try to get blog posts
    const blogPosts = await kv.get('blog-posts')
    debug.tests.blogPosts = {
      exists: !!blogPosts,
      count: Array.isArray(blogPosts) ? blogPosts.length : 0,
      type: blogPosts ? typeof blogPosts : 'null'
    }
    
    // If no blog posts, initialize empty array
    if (!blogPosts) {
      await kv.set('blog-posts', [])
      debug.tests.blogPostsInitialized = true
    }
  } catch (error) {
    debug.tests.blogPostsError = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json({
    success: debug.kvWorking,
    message: debug.kvWorking 
      ? '✅ KV is working! Blog posts should persist.' 
      : '❌ KV is not working. Check the error details.',
    debug
  })
}