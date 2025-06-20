import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to the 28.webp image (terms & conditions)
    const imagePath = path.join(process.cwd(), 'public', 'images', '28.webp');
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving terms & conditions image:', error);
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    );
  }
}