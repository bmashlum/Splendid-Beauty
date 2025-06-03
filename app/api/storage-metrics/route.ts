import { NextResponse } from 'next/server';
import { getStorageInstance } from '@/lib/vercel-kv-storage';

interface StorageMetrics {
  totalSize: number;
  totalSizeFormatted: string;
  blogPostsSize: number;
  blogPostsCount: number;
  eventsSize: number;
  eventsCount: number;
  usagePercentage: number;
  remainingSize: number;
  remainingSizeFormatted: string;
  isNearLimit: boolean;
  isAtLimit: boolean;
  storageType: string;
}

const VERCEL_KV_FREE_LIMIT = 30 * 1024 * 1024; // 30MB in bytes
const WARNING_THRESHOLD = 0.8; // 80%
const CRITICAL_THRESHOLD = 0.95; // 95%

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateSize(data: any): number {
  // Calculate the size of JSON-serialized data
  try {
    return new TextEncoder().encode(JSON.stringify(data)).length;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const storage = getStorageInstance();
    
    // Get data from storage
    const [blogPosts, events] = await Promise.all([
      storage.getBlogPosts(),
      storage.getEvents()
    ]);

    // Calculate sizes
    const blogPostsSize = calculateSize(blogPosts);
    const eventsSize = calculateSize(events);
    const totalSize = blogPostsSize + eventsSize;

    // Calculate usage metrics
    const usagePercentage = (totalSize / VERCEL_KV_FREE_LIMIT) * 100;
    const remainingSize = Math.max(0, VERCEL_KV_FREE_LIMIT - totalSize);
    const isNearLimit = usagePercentage >= WARNING_THRESHOLD * 100;
    const isAtLimit = usagePercentage >= CRITICAL_THRESHOLD * 100;

    // Determine storage type
    let storageType = 'Unknown';
    if (process.env.VERCEL && process.env.KV_URL) {
      storageType = 'Vercel KV (Redis)';
    } else if (process.env.VERCEL) {
      storageType = 'In-Memory (Fallback)';
    } else {
      storageType = 'File System (Development)';
    }

    const metrics: StorageMetrics = {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      blogPostsSize,
      blogPostsCount: blogPosts.length,
      eventsSize,
      eventsCount: events.length,
      usagePercentage: Math.round(usagePercentage * 100) / 100,
      remainingSize,
      remainingSizeFormatted: formatBytes(remainingSize),
      isNearLimit,
      isAtLimit,
      storageType,
    };

    return NextResponse.json({
      success: true,
      metrics,
      limits: {
        maxSize: VERCEL_KV_FREE_LIMIT,
        maxSizeFormatted: formatBytes(VERCEL_KV_FREE_LIMIT),
        warningThreshold: WARNING_THRESHOLD * 100,
        criticalThreshold: CRITICAL_THRESHOLD * 100,
      }
    });

  } catch (error) {
    console.error('Error calculating storage metrics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate storage metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}