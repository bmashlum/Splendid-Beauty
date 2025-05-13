import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises'; // Using fs.promises for async operations
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { z } from 'zod'; // For input validation

// Define the data directory and file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_FILE = path.join(DATA_DIR, 'blog-posts.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'blog');

// Zod schema for BlogPost validation
const blogPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1),
  excerpt: z.string(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string(), // URL path
  imageAlt: z.string(),
  author: z.string().min(1, "Author is required"),
  publishedAt: z.string().datetime({ offset: true }).nullable(),
  status: z.enum(['draft', 'published']),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

// Ensure directories exist (run once on server start)
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    try {
      await fs.access(BLOG_FILE);
    } catch {
      await fs.writeFile(BLOG_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Failed to initialize data directories or blog file:", error);
  }
})();

// In-memory cache for blog posts
let postsCache: BlogPost[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = process.env.NODE_ENV === 'development' ? 0 : 5000; // 5 seconds cache in prod, 0 in dev

async function getBlogPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
  const now = Date.now();
  if (!forceRefresh && postsCache && (now - cacheTimestamp < CACHE_DURATION_MS)) {
    return postsCache;
  }
  try {
    const data = await fs.readFile(BLOG_FILE, 'utf8');
    postsCache = JSON.parse(data) as BlogPost[]; // Add type assertion
    cacheTimestamp = now;
    return postsCache;
  } catch (error) {
    console.error('Error reading blog posts file:', error);
    postsCache = null; // Invalidate cache on error
    return []; // Return empty or throw, depending on desired behavior
  }
}

async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  try {
    await fs.writeFile(BLOG_FILE, JSON.stringify(posts, null, 2));
    postsCache = posts; // Update cache
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error writing blog posts file:', error);
    throw new Error('Failed to save blog posts'); // Propagate error
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

async function processAndSaveImage(imageBuffer: Buffer, fileNameBase: string): Promise<string> {
  const uniqueFileName = `${fileNameBase}-${Date.now()}.webp`; // Use timestamp for uniqueness and webp
  const filePath = path.join(IMAGES_DIR, uniqueFileName);
  
  try {
    await sharp(imageBuffer)
      .resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 }) // Convert to WebP for better compression and quality
      .toFile(filePath);
    return `/uploads/blog/${uniqueFileName}`;
  } catch (error) {
    console.error('Error processing image with Sharp:', error);
    // Fallback: try to save original if sharp fails (though less likely with buffer input)
    // For simplicity, we'll throw. In a real app, you might save the original or a placeholder.
    throw new Error('Image processing failed');
  }
}

// GET handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status') as BlogPost['status'] | 'all';
    
    let posts = await getBlogPosts();
    
    if (id) {
      const post = posts.find(p => p.id === id);
      return post 
        ? NextResponse.json({ post })
        : NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    if (status && status !== 'all') {
      posts = posts.filter(post => post.status === status);
    }
    
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/blog Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const now = new Date().toISOString();

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      author: formData.get('author') as string,
      status: formData.get('status') as BlogPost['status'],
      imageAlt: formData.get('imageAlt') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywordsInput: formData.get('keywords') as string,
    };

    // Basic validation
    if (!rawData.title || !rawData.content) {
      return NextResponse.json({ error: 'Title and Content are required' }, { status: 400 });
    }
    
    const imageFile = formData.get('image') as File | null;
    let featuredImage = '';

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const slugForFileName = generateSlug(rawData.title) || 'untitled';
      featuredImage = await processAndSaveImage(buffer, slugForFileName);
    }
    
    const newPostData: Omit<BlogPost, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { publishedAt?: string | null } = {
      title: rawData.title,
      content: rawData.content,
      excerpt: rawData.excerpt || rawData.content.substring(0, 150) + (rawData.content.length > 150 ? '...' : ''),
      author: rawData.author || 'Splendid Beauty Team',
      status: rawData.status || 'draft',
      featuredImage,
      imageAlt: rawData.imageAlt || rawData.title,
      seo: {
        metaTitle: rawData.metaTitle || rawData.title,
        metaDescription: rawData.metaDescription || rawData.excerpt || rawData.content.substring(0, 160) + (rawData.content.length > 160 ? '...' : ''),
        keywords: rawData.keywordsInput ? rawData.keywordsInput.split(',').map(k => k.trim()).filter(Boolean) : [],
      }
    };
    
    const newPost: BlogPost = {
      ...newPostData,
      id: uuidv4(),
      slug: generateSlug(newPostData.title),
      publishedAt: newPostData.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
    };

    // Validate with Zod before saving (optional, but good practice)
    // blogPostSchema.parse(newPost); 

    const posts = await getBlogPosts(true); // Force refresh before adding
    posts.push(newPost);
    await saveBlogPosts(posts);
    
    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating blog post' }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const posts = await getBlogPosts(true); // Force refresh
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const existingPost = posts[postIndex];
    const now = new Date().toISOString();

    const rawData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      author: formData.get('author') as string,
      status: formData.get('status') as BlogPost['status'],
      imageAlt: formData.get('imageAlt') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      keywordsInput: formData.get('keywords') as string,
    };
    
    let featuredImage = existingPost.featuredImage;
    const imageFile = formData.get('image') as File | null;

    if (imageFile) {
      // Delete old image if it's different and exists
      if (existingPost.featuredImage && existingPost.featuredImage.startsWith('/uploads/blog/')) {
        const oldImagePath = path.join(process.cwd(), 'public', existingPost.featuredImage);
        try {
          await fs.unlink(oldImagePath);
        } catch (unlinkError) {
          console.warn(`Failed to delete old image ${oldImagePath}:`, unlinkError);
        }
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const slugForFileName = generateSlug(rawData.title || existingPost.title) || 'untitled';
      featuredImage = await processAndSaveImage(buffer, slugForFileName);
    }

    const updatedPostData: Partial<BlogPost> = {
      title: rawData.title || existingPost.title,
      content: rawData.content || existingPost.content,
      author: rawData.author || existingPost.author,
      status: rawData.status || existingPost.status,
      imageAlt: rawData.imageAlt || rawData.title || existingPost.title,
      seo: {
        metaTitle: rawData.metaTitle || rawData.title || existingPost.seo.metaTitle,
        metaDescription: rawData.metaDescription || rawData.excerpt || (rawData.content || existingPost.content).substring(0, 160),
        keywords: rawData.keywordsInput ? rawData.keywordsInput.split(',').map(k => k.trim()).filter(Boolean) : existingPost.seo.keywords,
      },
      featuredImage, // This will be the new one if uploaded, or existing if not
    };
    updatedPostData.slug = generateSlug(updatedPostData.title!); // Ensure slug is updated if title changes
    updatedPostData.excerpt = rawData.excerpt || (updatedPostData.content!).substring(0, 150) + ((updatedPostData.content!).length > 150 ? '...' : '');

    if (updatedPostData.status === 'published' && existingPost.status === 'draft') {
      updatedPostData.publishedAt = now;
    } else if (updatedPostData.status === 'draft') {
      updatedPostData.publishedAt = null;
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updatedPostData,
      updatedAt: now,
    };
    
    // blogPostSchema.parse(updatedPost); // Validate before saving

    posts[postIndex] = updatedPost;
    await saveBlogPosts(posts);
    
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("PUT /api/blog Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error updating blog post' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    const posts = await getBlogPosts(true); // Force refresh
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const postToDelete = posts[postIndex];
    if (postToDelete.featuredImage && postToDelete.featuredImage.startsWith('/uploads/blog/')) {
      const imagePath = path.join(process.cwd(), 'public', postToDelete.featuredImage);
      try {
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.warn(`Failed to delete image ${imagePath} for post ${id}:`, unlinkError);
      }
    }

    const updatedPosts = posts.filter(post => post.id !== id);
    await saveBlogPosts(updatedPosts);
    
    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    console.error("DELETE /api/blog Error:", error);
    return NextResponse.json({ error: 'Error deleting blog post' }, { status: 500 });
  }
}