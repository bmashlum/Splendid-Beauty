#!/bin/bash

# Script to download blog and events data from production
# Usage: ./scripts/download-production-data.sh

DOMAIN="https://splendid-beauty.vercel.app"

# Check if domain argument is provided
if [ "$1" ]; then
    DOMAIN="$1"
fi

echo "Downloading data from: $DOMAIN"
echo "================================"

# Create backup of existing data
if [ -f "data/blog-posts.json" ]; then
    cp data/blog-posts.json data/blog-posts.backup.json
    echo "✓ Backed up existing blog-posts.json"
fi

if [ -f "data/events.json" ]; then
    cp data/events.json data/events.backup.json
    echo "✓ Backed up existing events.json"
fi

# Download blog posts
echo ""
echo "Downloading blog posts..."
curl -s "$DOMAIN/api/blog" | jq '.posts' > data/blog-posts.json
if [ $? -eq 0 ]; then
    echo "✓ Downloaded blog posts successfully"
else
    echo "✗ Failed to download blog posts"
fi

# Download events
echo ""
echo "Downloading events..."
curl -s "$DOMAIN/api/events" | jq '.events' > data/events.json
if [ $? -eq 0 ]; then
    echo "✓ Downloaded events successfully"
else
    echo "✗ Failed to download events"
fi

echo ""
echo "================================"
echo "Download complete!"
echo ""
echo "Next steps:"
echo "1. Review the downloaded files in data/"
echo "2. Commit changes: git add data/ && git commit -m 'Update production data'"
echo "3. Push to deploy: git push origin develop"