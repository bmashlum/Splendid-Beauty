import { NextResponse } from 'next/server'
import { getStorageInstance } from '@/lib/vercel-kv-storage'

export async function GET() {
  try {
    const storage = getStorageInstance()
    
    // Test reading data
    const [blogPosts, events] = await Promise.all([
      storage.getBlogPosts(),
      storage.getEvents()
    ])
    
    const storageType = process.env.KV_URL ? 'Vercel KV' : 
                       process.env.VERCEL ? 'In-Memory' : 'File System'
    
    return NextResponse.json({
      success: true,
      storageType,
      data: {
        blogPosts: blogPosts.length,
        events: events.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('KV test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Test write operation (for authenticated users only)
export async function POST() {
  try {
    const storage = getStorageInstance()
    
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
    const posts = await storage.getBlogPosts()
    const testPosts = [...posts, testPost]
    
    // Save back to storage
    await storage.saveBlogPosts(testPosts)
    
    // Immediately read back to verify
    const verifyPosts = await storage.getBlogPosts()
    const testPostExists = verifyPosts.some(p => p.id === testPost.id)
    
    // Clean up - remove test post
    const cleanedPosts = verifyPosts.filter(p => p.id !== testPost.id)
    await storage.saveBlogPosts(cleanedPosts)
    
    return NextResponse.json({
      success: true,
      writeTest: testPostExists,
      message: testPostExists ? 'KV write/read test passed' : 'KV write/read test failed',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('KV write test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}