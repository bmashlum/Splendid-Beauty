#!/bin/bash

# Enhanced video optimization script for production deployment
# Creates highly optimized videos with better compression and streaming support

SOURCE_DIR="public/images/mp4backup"
OUTPUT_DIR="public/images/optimized"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to optimize a single video
optimize_video() {
    local input_file="$1"
    local filename=$(basename "$input_file" .mp4)
    local output_file="$OUTPUT_DIR/${filename}_optimized.mp4"
    
    echo "Optimizing: $filename"
    
    # Two-pass encoding for better quality/size ratio
    # First pass - analyze video
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" \
        -an \
        -pass 1 \
        -f mp4 \
        -y /dev/null
    
    # Second pass - encode video with optimizations
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" \
        -c:a aac \
        -b:a 96k \
        -ac 2 \
        -pass 2 \
        -movflags +faststart \
        -pix_fmt yuv420p \
        -profile:v baseline \
        -level 3.0 \
        -maxrate 1M \
        -bufsize 2M \
        -g 30 \
        -y "$output_file"
    
    # Clean up pass log files
    rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree
    
    # Get file sizes for comparison
    original_size=$(ls -lh "$input_file" | awk '{print $5}')
    optimized_size=$(ls -lh "$output_file" | awk '{print $5}')
    
    echo "✓ $filename: $original_size → $optimized_size"
    echo ""
}

# Process all MP4 files
echo "Starting video optimization for production..."
echo "========================================"

for video in "$SOURCE_DIR"/*.mp4; do
    if [ -f "$video" ]; then
        optimize_video "$video"
    fi
done

# Create WebM versions for better browser support
echo "Creating WebM versions for modern browsers..."
echo "========================================"

for video in "$SOURCE_DIR"/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        output_webm="$OUTPUT_DIR/${filename}_optimized.webm"
        
        echo "Creating WebM: $filename"
        
        ffmpeg -i "$video" \
            -c:v libvpx-vp9 \
            -crf 35 \
            -b:v 0 \
            -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" \
            -c:a libopus \
            -b:a 96k \
            -ac 2 \
            -row-mt 1 \
            -y "$output_webm"
        
        webm_size=$(ls -lh "$output_webm" | awk '{print $5}')
        echo "✓ $filename.webm: $webm_size"
        echo ""
    fi
done

echo "========================================"
echo "Video optimization complete!"
echo ""
echo "Optimization settings used:"
echo "- Max resolution: 1280x720 (maintains aspect ratio)"
echo "- H.264 baseline profile for compatibility"
echo "- CRF 28 for good quality/size balance"
echo "- Max bitrate: 1 Mbps"
echo "- Fast start flag for web streaming"
echo "- WebM versions for modern browsers"
echo ""
echo "Videos optimized: $(ls -1 "$OUTPUT_DIR"/*_optimized.mp4 2>/dev/null | wc -l) MP4 files"
echo "WebM versions: $(ls -1 "$OUTPUT_DIR"/*_optimized.webm 2>/dev/null | wc -l) WebM files"