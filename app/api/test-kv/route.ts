import { NextResponse } from 'next/server'
import { getStorageInstance } from '@/lib/vercel-kv-storage'

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      isVercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV,
      hasKvUrl: !!process.env.KV_URL,
      hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
      hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      hasKvRestApiReadOnlyToken: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
    },
    tests: {
      storageType: 'unknown',
      healthCheck: false,
      blogPostsCount: 0,
      eventsCount: 0,
      canReadData: false,
    },
    errors: []
  }

  try {
    console.log('[Test-KV] Getting storage instance...')
    const storage = await getStorageInstance()
    diagnostics.tests.storageType = storage.constructor.name
    console.log(`[Test-KV] Storage type: ${storage.constructor.name}`)

    // Run health check if available
    if (storage.healthCheck) {
      try {
        console.log('[Test-KV] Running health check...')
        const isHealthy = await storage.healthCheck()
        diagnostics.tests.healthCheck = isHealthy
        console.log(`[Test-KV] Health check: ${isHealthy}`)
      } catch (error) {
        diagnostics.errors.push({
          test: 'healthCheck',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Test reading data
    try {
      console.log('[Test-KV] Reading blog posts and events...')
      const [blogPosts, events] = await Promise.all([
        storage.getBlogPosts(),
        storage.getEvents()
      ])
      
      diagnostics.tests.blogPostsCount = blogPosts.length
      diagnostics.tests.eventsCount = events.length
      diagnostics.tests.canReadData = true
      console.log(`[Test-KV] Found ${blogPosts.length} blog posts and ${events.length} events`)
    } catch (error) {
      diagnostics.errors.push({
        test: 'readData',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Check KV client availability
    try {
      const kvClientModule = await import('@/lib/vercel-kv-client')
      const kvConnected = await kvClientModule.testKVConnection()
      diagnostics.tests.kvConnection = kvConnected
    } catch {
      diagnostics.tests.kvConnection = false
    }

    const isKVWorking = diagnostics.tests.storageType === 'VercelKVStorage' && 
                       diagnostics.tests.healthCheck && 
                       diagnostics.tests.canReadData

    return NextResponse.json({
      success: isKVWorking,
      message: isKVWorking 
        ? '✅ KV is properly configured and working!' 
        : '❌ KV is not properly configured. See diagnostics below.',
      diagnostics,
      setupGuide: !isKVWorking ? '/VERCEL_KV_SETUP_GUIDE.md' : undefined
    })
  } catch (error) {
    console.error('[Test-KV] Unexpected error:', error)
    diagnostics.errors.push({
      test: 'general',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json({
      success: false,
      message: 'KV test failed with unexpected error',
      diagnostics
    }, { status: 500 })
  }
}

// Test write operation (for authenticated users only)
export async function POST() {
  try {
    console.log('[Test-KV POST] Starting write test...')
    const storage = await getStorageInstance()
    console.log(`[Test-KV POST] Using storage: ${storage.constructor.name}`)
    
    // Create a test blog post
    const testPost = {
      id: 'test-' + Date.now(),
      title: 'KV Test Post',
      slug: 'kv-test-post',
      excerpt: 'Testing KV storage',
      content: 'This is a test post to verify KV storage is working.',
      featuredImage: '',
      imageAlt: '',
      author: 'System Test',
      publishedAt: null,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'KV Test',
        metaDescription: 'Test post',
        keywords: ['test']
      }
    }
    
    // Get existing posts and add test post
    console.log('[Test-KV POST] Getting existing posts...')
    const posts = await storage.getBlogPosts()
    console.log(`[Test-KV POST] Found ${posts.length} existing posts`)
    
    const testPosts = [...posts, testPost]
    
    // Save back to storage
    console.log('[Test-KV POST] Saving test post...')
    await storage.saveBlogPosts(testPosts)
    
    // Wait a bit for propagation
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Immediately read back to verify
    console.log('[Test-KV POST] Verifying save...')
    const verifyPosts = await storage.getBlogPosts()
    const testPostExists = verifyPosts.some(p => p.id === testPost.id)
    console.log(`[Test-KV POST] Test post exists: ${testPostExists}`)
    
    // Clean up - remove test post
    console.log('[Test-KV POST] Cleaning up test post...')
    const cleanedPosts = verifyPosts.filter(p => p.id !== testPost.id)
    await storage.saveBlogPosts(cleanedPosts)
    
    return NextResponse.json({
      success: true,
      writeTest: testPostExists,
      storageType: storage.constructor.name,
      message: testPostExists ? 'KV write/read test passed' : 'KV write/read test failed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Test-KV POST] Write test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}