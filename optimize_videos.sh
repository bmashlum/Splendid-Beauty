#!/bin/bash

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is not installed. Please install it first."
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p public/images/optimized

# Process all MP4 files in the images directory
for video in public/images/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video")
        echo "Optimizing $filename..."
        
        # Use CRF 23 for high quality, medium preset for good compression
        ffmpeg -y -i "$video" \
            -c:v libx264 \
            -crf 23 \
            -preset medium \
            -c:a aac \
            -b:a 128k \
            -movflags +faststart \
            "public/images/optimized/${filename%.*}_optimized.mp4"
            
        echo "Completed $filename"
    fi
done

echo "All videos have been optimized!" 