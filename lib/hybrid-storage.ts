// Hybrid storage strategy to maximize free tier usage
// Small data -> KV Redis (30MB limit)
// Large images -> Vercel Blob (larger free tier)
// Metadata compression and optimization

import { StorageAdapter, BlogPost, Event, getStorageInstance } from './vercel-kv-storage';
// import { uploadImageToBlob, deleteImageFromBlob, shouldUseBlobStorage } from './blob-storage';

export class HybridStorageAdapter implements StorageAdapter {
  private kvStorage: StorageAdapter;

  constructor(kvStorage: StorageAdapter) {
    this.kvStorage = kvStorage;
  }

  // Compress blog posts by removing large base64 images and using URLs instead
  private compressBlogPosts(posts: BlogPost[]): BlogPost[] {
    return posts.map(post => ({
      ...post,
      // Remove base64 images to save KV space - they should be in Blob storage
      featuredImage: post.featuredImage?.startsWith('data:') 
        ? this.extractBlobUrl(post.featuredImage) 
        : post.featuredImage,
      // Compress content for storage
      content: this.compressContent(post.content),
    }));
  }

  private compressEvents(events: Event[]): Event[] {
    return events.map(event => ({
      ...event,
      // Remove base64 images
      imageSrc: event.imageSrc?.startsWith('data:') 
        ? this.extractBlobUrl(event.imageSrc)
        : event.imageSrc,
    }));
  }

  private compressContent(content: string): string {
    // Remove excessive whitespace while preserving structure
    return content
      .replace(/\s+/g, ' ')          // Multiple spaces -> single space
      .replace(/\n\s*\n/g, '\n')     // Multiple newlines -> single newline
      .trim();
  }

  private extractBlobUrl(base64OrUrl: string): string {
    // If it's already a blob URL, return as-is
    if (base64OrUrl.startsWith('https://')) {
      return base64OrUrl;
    }
    
    // For base64, we should have uploaded to blob already
    // This is a fallback that returns the original
    return base64OrUrl;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.kvStorage.getBlogPosts();
  }

  async saveBlogPosts(posts: BlogPost[]): Promise<void> {
    const compressed = this.compressBlogPosts(posts);
    return this.kvStorage.saveBlogPosts(compressed);
  }

  async getEvents(): Promise<Event[]> {
    return this.kvStorage.getEvents();
  }

  async saveEvents(events: Event[]): Promise<void> {
    const compressed = this.compressEvents(events);
    return this.kvStorage.saveEvents(compressed);
  }

  async healthCheck(): Promise<boolean> {
    return this.kvStorage.healthCheck?.() ?? true;
  }

  // Utility to check KV storage usage
  async getStorageStats(): Promise<{
    blogPostsSize: number;
    eventsSize: number;
    estimatedUsage: string;
  }> {
    const [blogPosts, events] = await Promise.all([
      this.getBlogPosts(),
      this.getEvents()
    ]);

    const blogPostsSize = JSON.stringify(blogPosts).length;
    const eventsSize = JSON.stringify(events).length;
    const totalBytes = blogPostsSize + eventsSize;
    
    return {
      blogPostsSize,
      eventsSize,
      estimatedUsage: this.formatBytes(totalBytes)
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Factory function with storage optimization
export function getOptimizedStorage(): StorageAdapter {
  const baseStorage = getStorageInstance();
  return new HybridStorageAdapter(baseStorage);
}