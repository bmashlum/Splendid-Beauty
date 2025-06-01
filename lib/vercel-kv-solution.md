# Vercel KV Solution for Blog/Events Storage

## Problem
The current implementation uses file system operations which don't work in Vercel's serverless environment because:
- File system is read-only (except `/tmp`)
- Files in `/tmp` don't persist between function invocations
- No shared state between serverless functions

## Recommended Solution: Vercel KV

Vercel KV is a durable Redis-compatible database that's perfect for this use case:
- **Free tier**: 30MB storage, 10,000 requests/day
- **Serverless-ready**: Works perfectly with Vercel functions
- **Fast**: Redis-based for quick reads/writes
- **Simple API**: Easy to integrate

## Implementation Steps

### 1. Enable Vercel KV
```bash
# In your Vercel dashboard:
# 1. Go to your project
# 2. Click "Storage" tab
# 3. Create a KV database
# 4. It will automatically add environment variables
```

### 2. Install Vercel KV SDK
```bash
npm install @vercel/kv
```

### 3. Update Storage Implementation

```typescript
// lib/kv-storage.ts
import { kv } from '@vercel/kv';
import { BlogPost } from '@/app/api/blog/route';
import { Event } from '@/app/api/events/route';

// Blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await kv.get<BlogPost[]>('blog-posts');
  return posts || [];
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await kv.set('blog-posts', posts);
}

// Events
export async function getEvents(): Promise<Event[]> {
  const events = await kv.get<Event[]>('events');
  return events || [];
}

export async function saveEvents(events: Event[]): Promise<void> {
  await kv.set('events', events);
}

// Images - store as base64 in KV or use Vercel Blob
export async function saveImage(key: string, base64Data: string): Promise<void> {
  await kv.set(`image:${key}`, base64Data);
}

export async function getImage(key: string): Promise<string | null> {
  return await kv.get<string>(`image:${key}`);
}
```

### 4. Update API Routes

Replace file system operations with KV operations:

```typescript
// In blog/route.ts
import { getBlogPosts, saveBlogPosts } from '@/lib/kv-storage';

// Replace fs.readFile with:
const posts = await getBlogPosts();

// Replace fs.writeFile with:
await saveBlogPosts(posts);
```

## Alternative: Simple JSON in Environment Variables

For very small datasets, you can store JSON directly in environment variables:

```typescript
// lib/env-storage.ts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = process.env.BLOG_POSTS_DATA;
  return data ? JSON.parse(data) : [];
}

// Note: This is read-only, updates would need to go through Vercel API
```

## Alternative: GitHub as Database

Use GitHub API to store JSON files in a repository:

```typescript
// lib/github-storage.ts
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: 'your-username',
      repo: 'your-data-repo',
      path: 'blog-posts.json',
    });
    
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString();
      return JSON.parse(content);
    }
  } catch {
    return [];
  }
}

export async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  const content = Buffer.from(JSON.stringify(posts, null, 2)).toString('base64');
  
  // Get current file to get its SHA
  const { data: currentFile } = await octokit.repos.getContent({
    owner: 'your-username',
    repo: 'your-data-repo',
    path: 'blog-posts.json',
  });
  
  await octokit.repos.createOrUpdateFileContents({
    owner: 'your-username',
    repo: 'your-data-repo',
    path: 'blog-posts.json',
    message: 'Update blog posts',
    content,
    sha: 'sha' in currentFile ? currentFile.sha : undefined,
  });
}
```

## Recommendation

**Use Vercel KV** - it's the simplest solution that:
- Works perfectly with Vercel's serverless environment
- Has a generous free tier
- Requires minimal code changes
- Provides fast, reliable storage
- Supports atomic operations
- No external dependencies

The implementation is straightforward and maintains the same API interface as your current file-based solution.