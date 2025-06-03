# Setting Up Redis in Vercel

Since you have a Redis instance already connected, you need to add the Redis URL as an environment variable that our code can use.

## Quick Setup

1. **Go to your Vercel project settings**
   - Visit: https://vercel.com/dashboard
   - Click on your "Splendid Beauty" project
   - Go to "Settings" → "Environment Variables"

2. **Add the REDIS_URL variable**
   - Click "Add New"
   - **Key**: `REDIS_URL`
   - **Value**: `redis://default:RhMupMo3TqJkM7QVAJWhXGVXLPbDFIvT@redis-16842.c15.us-east-1-4.ec2.redns.redis-cloud.com:16842`
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy your application**
   - Go to the "Deployments" tab
   - Click the three dots on your latest deployment
   - Select "Redeploy"

## Verification

After deployment, visit these URLs to verify Redis is working:

1. **Test endpoint**: https://splendid-beauty.vercel.app/api/test-kv
   - Should show `storageType: "RedisStorageAdapter"`
   - `healthCheck` should be `true`

2. **Debug endpoint**: https://splendid-beauty.vercel.app/api/kv-debug
   - Should show Redis is working

## What This Does

- The application will now use your Redis instance to store blog posts and events
- Data will persist across deployments
- Blog posts won't disappear when you refresh the page

## Troubleshooting

If it's not working:

1. **Check environment variables** - Make sure REDIS_URL is set in Vercel
2. **Check deployment logs** - Look for "[Redis] Connected successfully" messages
3. **Test the connection** - Visit the test endpoints above

The system will automatically fall back to in-memory storage if Redis isn't available, but you'll see warnings in the logs.