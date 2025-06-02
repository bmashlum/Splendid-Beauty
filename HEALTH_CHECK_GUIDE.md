# Health Check System Documentation

## Overview

The health check system monitors the application's health and reports various system metrics through the `/api/health` endpoint and the admin performance dashboard.

## Storage Write Test

The "Write Storage" check verifies that the application can write data. This works differently in different environments:

- **Local Development**: Writes test files to the `data` directory
- **Vercel Production**: Uses Vercel KV (Redis) for write tests

## Fixing "Storage write test failed" Error

### On Vercel

If you see "Storage write test failed - Check Vercel KV configuration in dashboard":

1. **Enable Vercel KV Storage**:
   - Go to your Vercel project dashboard
   - Navigate to the "Storage" tab
   - Click "Create Database"
   - Select "KV" (Redis-compatible)
   - Follow the setup wizard

2. **Environment Variables**:
   Vercel automatically adds these environment variables when you create a KV store:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

3. **Redeploy**:
   - After enabling KV, redeploy your application
   - The health check should now pass

### Local Development

If you see "Storage write test failed - Check filesystem permissions":

1. **Check data directory**:
   ```bash
   # Ensure the data directory exists
   mkdir -p data
   
   # Check permissions
   ls -la data/
   ```

2. **Fix permissions** (if needed):
   ```bash
   chmod 755 data
   ```

## Health Check Components

### 1. Write Storage
- Tests write capability
- Uses filesystem locally, Vercel KV in production

### 2. Cache
- Tests in-memory cache functionality
- Should always pass unless memory issues

### 3. Environment
- Checks required environment variables
- Verifies authentication configuration

### 4. Storage
- Tests ability to read blog posts and events
- Uses appropriate storage adapter

### 5. Memory
- Monitors heap usage
- Warns if usage exceeds 90%

### 6. Services
- **Auth**: JWT configuration
- **Analytics**: Google Analytics setup
- **Maps**: Google Maps API configuration

## Testing

Run the health check test script:
```bash
node scripts/test-health-check.js
```

Or visit the endpoints directly:
- Health API: `/api/health`
- Admin Dashboard: `/admin/performance`

## Troubleshooting

### Common Issues

1. **"KV not available for health check"**
   - Vercel KV is not configured
   - Check environment variables
   - Enable KV in Vercel dashboard

2. **"Failed to initialize Vercel KV"**
   - Missing @vercel/kv package
   - Run: `npm install @vercel/kv`

3. **High memory usage**
   - Consider upgrading Vercel plan
   - Optimize image sizes
   - Implement better caching strategies

### Debug Mode

Set these environment variables for more verbose logging:
```bash
DEBUG=vercel-kv
NODE_ENV=development
```

## Architecture

The storage system uses an adapter pattern:

```
StorageAdapter (interface)
├── FileStorage (local development)
├── VercelKVStorage (production with KV)
└── InMemoryStorage (fallback)
```

Each adapter implements:
- `getBlogPosts()`
- `saveBlogPosts()`
- `getEvents()`
- `saveEvents()`
- `healthCheck()` (optional)

The health check automatically selects the appropriate adapter based on the environment.
