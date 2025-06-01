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
        
        # Use CRF 18 for very high quality, slow preset for better compression
        # Added -r 60 for 60fps output and motion interpolation filter
        # -an removes all audio tracks to save space
        ffmpeg -y -i "$video" \
            -c:v libx264 \
            -crf 18 \
            -preset slow \
            -r 60 \
            -vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
            -an \
            -movflags +faststart \
            "public/images/optimized/${filename%.*}_optimized.mp4"
            
        echo "Completed $filename"
    fi
done

echo "All videos have been optimized!" 