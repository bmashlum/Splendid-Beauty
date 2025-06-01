#!/bin/bash

echo "🚀 Starting Splendid Beauty App..."
echo "================================="

# Kill any existing process on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use. Killing existing process..."
    kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 1
fi

# Clean Next.js cache
echo "🧹 Cleaning cache..."
rm -rf .next

# Start the development server
echo "🌟 Starting development server..."
echo "📱 App will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================="

npm run dev
