#!/bin/bash

# Create a backup directory
BACKUP_DIR="image_backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Function to process each PNG file
process_image() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo "Processing $filename..."
    
    # Create backup
    cp "$file" "$BACKUP_DIR/$filename"
    
    # First pass: pngquant (lossy compression)
    pngquant --force --quality=90-100 --strip --skip-if-larger --output "${file}.tmp" "$file"
    if [ $? -eq 0 ]; then
        mv "${file}.tmp" "$file"
    fi
    
    # Second pass: optipng (lossless optimization)
    optipng -o7 -strip all "$file"
    
    echo "Completed $filename"
}

# Find all PNG files in the public/images directory
find public/images -name "*.png" -type f | while read -r file; do
    process_image "$file"
done

echo "Image optimization complete! Original files backed up in $BACKUP_DIR" 