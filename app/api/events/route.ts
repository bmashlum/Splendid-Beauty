import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises'; // Using fs.promises for async operations
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { z } from 'zod'; // For input validation

// Define the data directory and file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'events');

// Optimal dimensions (example: 21:8 aspect ratio for wide banners)
const OPTIMAL_WIDTH = 1680;
const OPTIMAL_HEIGHT = 640;

// Zod schema for Event validation
const eventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"), // Format "yyyy-MM-dd"
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string(), // URL path
  imageAlt: z.string(),
  link: z.string().url().or(z.literal('')).or(z.literal('#')), // Allow empty, #, or valid URL
  imagePosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
  objectFit: z.enum(['cover', 'contain']).default('cover'),
  excerpt: z.string().optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type Event = z.infer<typeof eventSchema>;

// Ensure directories exist (run once on server start)
(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Failed to initialize data directories or events file:", error);
  }
})();

// In-memory cache for events
let eventsCache: Event[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION_MS = process.env.NODE_ENV === 'development' ? 0 : 5000; // 5 seconds cache in prod, 0 in dev

async function getEvents(forceRefresh: boolean = false): Promise<Event[]> {
  const now = Date.now();
  if (!forceRefresh && eventsCache && (now - cacheTimestamp < CACHE_DURATION_MS)) {
    return eventsCache;
  }
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    eventsCache = JSON.parse(data) as Event[]; // Add type assertion
    cacheTimestamp = now;
    return eventsCache;
  } catch (error) {
    console.error('Error reading events file:', error);
    eventsCache = null; // Invalidate cache
    return [];
  }
}

async function saveEvents(events: Event[]): Promise<void> {
  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
    eventsCache = events; // Update cache
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error writing events file:', error);
    throw new Error('Failed to save events');
  }
}

function generateSafeFileNameBase(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .substring(0, 50); // Max length for file name part
}

async function processAndSaveImage(imageBuffer: Buffer, fileNameBase: string): Promise<string> {
  const uniqueFileName = `${fileNameBase}-${Date.now()}.webp`; // Use timestamp and webp
  const filePath = path.join(IMAGES_DIR, uniqueFileName);

  try {
    // Resize to fit within OPTIMAL_WIDTH x OPTIMAL_HEIGHT, maintaining aspect ratio, then convert to WebP
    await sharp(imageBuffer)
      .resize({
        width: OPTIMAL_WIDTH,
        height: OPTIMAL_HEIGHT,
        fit: 'inside', // Ensures the image fits within dimensions without cropping, maintains aspect ratio
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(filePath);
    return `/uploads/events/${uniqueFileName}`;
  } catch (error) {
    console.error('Error processing event image with Sharp:', error);
    throw new Error('Event image processing failed');
  }
}

// GET handler
export async function GET() {
  try {
    const events = await getEvents();
    // Sort by creation date, newest first (optional, client can sort too)
    const sortedEvents = events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ events: sortedEvents });
  } catch (error) {
    console.error("GET /api/events Error:", error);
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
      date: formData.get('date') as string, // Expecting "yyyy-MM-dd"
      description: formData.get('description') as string,
      link: formData.get('link') as string,
      imageAlt: formData.get('imageAlt') as string,
      imagePosition: formData.get('imagePosition') as Event['imagePosition'],
      objectFit: formData.get('objectFit') as Event['objectFit'],
      excerpt: formData.get('excerpt') as string,
    };

    if (!rawData.title || !rawData.date || !rawData.description) {
      return NextResponse.json({ error: 'Title, Date, and Description are required' }, { status: 400 });
    }

    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required for new events' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileNameBase = generateSafeFileNameBase(rawData.title);
    const imageSrc = await processAndSaveImage(buffer, fileNameBase);

    const newEventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> = {
      title: rawData.title,
      date: rawData.date, // Store as "yyyy-MM-dd"
      description: rawData.description,
      imageSrc,
      imageAlt: rawData.imageAlt || rawData.title, // Default alt text to title
      link: rawData.link || '#',
      imagePosition: rawData.imagePosition || 'center',
      objectFit: rawData.objectFit || 'cover',
      excerpt: rawData.excerpt || rawData.description.substring(0, 140) + (rawData.description.length > 140 ? '...' : ''),
    };

    const newEvent: Event = {
      ...newEventData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    // eventSchema.parse(newEvent); // Validate with Zod

    const events = await getEvents(true);
    events.push(newEvent);
    await saveEvents(events);

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const events = await getEvents(true);
    const eventIndex = events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const existingEvent = events[eventIndex];
    const now = new Date().toISOString();

    const rawData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string, // Expecting "yyyy-MM-dd"
      description: formData.get('description') as string,
      link: formData.get('link') as string,
      imageAlt: formData.get('imageAlt') as string,
      imagePosition: formData.get('imagePosition') as Event['imagePosition'],
      objectFit: formData.get('objectFit') as Event['objectFit'],
      excerpt: formData.get('excerpt') as string,
      removeImage: formData.get('removeImage') === 'true'
    };

    let imageSrc = existingEvent.imageSrc;
    const imageFile = formData.get('image') as File | null;

    const oldImageRequiresDeletion = (newImageUploaded: boolean) =>
      existingEvent.imageSrc &&
      existingEvent.imageSrc.startsWith('/uploads/events/') &&
      (newImageUploaded || rawData.removeImage);

    if (imageFile) {
      if (oldImageRequiresDeletion(true)) {
        try { await fs.unlink(path.join(process.cwd(), 'public', existingEvent.imageSrc)); }
        catch (e) { console.warn(`Old image deletion failed for ${existingEvent.imageSrc}:`, e); }
      }
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileNameBase = generateSafeFileNameBase(rawData.title || existingEvent.title);
      imageSrc = await processAndSaveImage(buffer, fileNameBase);
    } else if (rawData.removeImage) {
      if (oldImageRequiresDeletion(false)) {
        try { await fs.unlink(path.join(process.cwd(), 'public', existingEvent.imageSrc)); }
        catch (e) { console.warn(`Image deletion failed for ${existingEvent.imageSrc}:`, e); }
      }
      imageSrc = ''; // Or a placeholder image path
    }

    const updatedEventData: Partial<Event> = {
      title: rawData.title || existingEvent.title,
      date: rawData.date || existingEvent.date,
      description: rawData.description || existingEvent.description,
      link: rawData.link !== undefined ? rawData.link : existingEvent.link, // Handle empty string for link
      imageAlt: rawData.imageAlt || rawData.title || existingEvent.title,
      imagePosition: rawData.imagePosition || existingEvent.imagePosition,
      objectFit: rawData.objectFit || existingEvent.objectFit,
      imageSrc,
    };
    updatedEventData.excerpt = rawData.excerpt || (updatedEventData.description!).substring(0, 140) + ((updatedEventData.description!).length > 140 ? '...' : '');


    const updatedEvent: Event = {
      ...existingEvent,
      ...updatedEventData,
      updatedAt: now,
    };

    // eventSchema.parse(updatedEvent); // Validate

    events[eventIndex] = updatedEvent;
    await saveEvents(events);

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error("PUT /api/events Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const events = await getEvents(true);
    const eventIndex = events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventToDelete = events[eventIndex];
    if (eventToDelete.imageSrc && eventToDelete.imageSrc.startsWith('/uploads/events/')) {
      const imagePath = path.join(process.cwd(), 'public', eventToDelete.imageSrc);
      try {
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.warn(`Failed to delete image ${imagePath} for event ${id}:`, unlinkError);
      }
    }

    const updatedEvents = events.filter(event => event.id !== id);
    await saveEvents(updatedEvents);

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error("DELETE /api/events Error:", error);
    return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
  }
}