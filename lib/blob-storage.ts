// Vercel Blob storage for large images
// This is separate from KV and has higher limits

import { put, del } from '@vercel/blob';

export async function uploadImageToBlob(
  imageBuffer: Buffer, 
  filename: string
): Promise<string> {
  try {
    const blob = await put(filename, imageBuffer, {
      access: 'public',
      contentType: 'image/webp',
    });
    
    return blob.url;
  } catch (error) {
    console.error('Failed to upload to Blob storage:', error);
    throw new Error('Image upload failed');
  }
}

export async function deleteImageFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Failed to delete from Blob storage:', error);
    // Don't throw - deletion failure shouldn't break the app
  }
}

// Check if we should use Blob storage based on image size
export function shouldUseBlobStorage(imageSize: number): boolean {
  // Use Blob for images > 1MB to save KV space
  return imageSize > 1024 * 1024;
}