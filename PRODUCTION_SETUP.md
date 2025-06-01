# Production Setup Guide for Splendid Beauty Bar

This guide provides step-by-step instructions for deploying and managing your website in production on Vercel.

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Security Configuration](#security-configuration)
3. [Performance Features](#performance-features)
4. [Monitoring & Error Tracking](#monitoring--error-tracking)
5. [Admin Dashboard](#admin-dashboard)
6. [Maintenance](#maintenance)

## Initial Setup

### 1. Environment Variables
Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following **REQUIRED** variables:

```bash
# Generate a secure JWT secret (run this command locally):
openssl rand -base64 32

# Then add these variables:
JWT_SECRET=<your-generated-32-character-secret>
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<strong-password-min-8-chars>
```

4. Add these **OPTIONAL** variables if you have them:

```bash
# Google Analytics (free)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Maps (if using the map feature)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use the Vercel dashboard to import your GitHub repository.

## Security Configuration

### Admin Credentials
1. **Username**: Set via `ADMIN_USERNAME` environment variable
2. **Password**: Set via `ADMIN_PASSWORD` environment variable
3. **Login URL**: `https://yourdomain.com/admin/login`

### Important Security Notes:
- JWT tokens expire after 24 hours
- Failed login attempts are logged
- All admin routes are protected by authentication
- Passwords are hashed using bcrypt
- HTTPS is enforced in production

### Changing Admin Password:
1. Go to Vercel dashboard
2. Update the `ADMIN_PASSWORD` environment variable
3. Redeploy your application

## Performance Features

### 1. Caching System
The application uses a free disk-based caching system that:
- Caches blog posts and events for 5 minutes
- Automatically clears when content is updated
- Stores cache in Vercel's `/tmp` directory (no additional cost)

### 2. Image Optimization
- All images are automatically optimized by Next.js
- WebP format is used when supported
- Lazy loading is enabled for better performance

### 3. Bundle Analysis
To analyze your bundle size:

```bash
# Run locally
npm run build:analyze

# This opens a visual representation of your bundle
```

### 4. Production Build
Always use the production build command:

```bash
npm run build:prod
```

This ensures:
- TypeScript errors are caught
- ESLint warnings are addressed
- Optimized production build

## Monitoring & Error Tracking

### 1. Health Check Endpoint
Monitor your application health at:
```
https://yourdomain.com/api/health
```

This returns:
- System status (healthy/degraded/unhealthy)
- Memory usage
- Cache status
- Service configuration status

### 2. Performance Dashboard
Access at: `https://yourdomain.com/admin/performance`

Features:
- Real-time system health
- Memory usage monitoring
- Error logs viewer
- Service status checks

### 3. Error Tracking
Errors are automatically:
- Logged to Google Analytics (if configured)
- Stored in memory for admin review
- Displayed in the Performance Dashboard

### Free Error Tracking Options:
1. **Google Analytics** (already integrated) - Errors sent as events
2. **Vercel Analytics** - Add to your Vercel project (free tier)
3. **LogRocket** - 1,000 sessions/month free
4. **Sentry** - 5,000 errors/month free

To add Sentry (optional):
```bash
# Install
npm install @sentry/nextjs

# Add environment variable
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 4. Web Vitals Monitoring
Core Web Vitals are automatically tracked and sent to Google Analytics.

Poor performance metrics are logged as warnings.

## Admin Dashboard

### Accessing the Admin Dashboard
1. Navigate to `https://yourdomain.com/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

### Admin Features:
1. **Events Management** - Create, edit, delete events
2. **Blog Management** - Create, edit, delete blog posts
3. **Performance Monitoring** - View system health and errors
4. **Image Uploads** - Automatic optimization and WebP conversion

### Dashboard URLs:
- Events: `/admin/events`
- Blog: `/admin/blog`
- Performance: `/admin/performance`

## Maintenance

### 1. Regular Tasks
- **Check Performance Dashboard** weekly
- **Clear error logs** when resolved
- **Monitor bundle size** after major updates

### 2. Updating Content
All content updates through the admin dashboard are:
- Automatically saved to JSON files
- Cache is cleared automatically
- Changes are live immediately

### 3. Backup Strategy
Since data is stored in JSON files:
- Vercel keeps deployment history
- You can download data via admin API:
  - Blog posts: `GET /api/blog`
  - Events: `GET /api/events`

### 4. Troubleshooting

**Application not loading:**
1. Check `/api/health` endpoint
2. Verify environment variables in Vercel
3. Check Vercel function logs

**Can't login to admin:**
1. Verify `JWT_SECRET` is set
2. Check username/password in env vars
3. Clear browser cookies and retry

**High memory usage:**
1. Check Performance Dashboard
2. Clear cache if needed
3. Restart deployment in Vercel

**Images not optimizing:**
1. Ensure images are in `/public/images`
2. Use supported formats (JPEG, PNG, WebP)
3. Check file size (max 5MB)

### 5. Monitoring Checklist

Daily:
- [ ] Check site is accessible
- [ ] Verify admin login works

Weekly:
- [ ] Review Performance Dashboard
- [ ] Check error logs
- [ ] Monitor Core Web Vitals

Monthly:
- [ ] Analyze bundle size
- [ ] Review and optimize images
- [ ] Update dependencies (carefully)

## Support

For issues:
1. Check the Performance Dashboard first
2. Review Vercel function logs
3. Check browser console for client-side errors

Remember: This is a production-ready application with built-in monitoring and error handling. Most issues can be diagnosed through the admin Performance Dashboard.