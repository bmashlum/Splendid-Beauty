# Admin Quick Reference Guide

## 🔐 Login Information
- **URL**: `https://splendidbeautybar.com/admin/login`
- **Username**: *(Set in Vercel environment variables)*
- **Password**: *(Set in Vercel environment variables)*

## 📋 Admin Dashboard URLs

| Section | URL | Purpose |
|---------|-----|---------|
| Events | `/admin/events` | Manage upcoming events and promotions |
| Blog | `/admin/blog` | Create and edit blog posts |
| Performance | `/admin/performance` | Monitor website health |

## ✏️ Managing Events

### To Add a New Event:
1. Go to Events section
2. Click "Add New Event"
3. Fill in:
   - Event title
   - Date
   - Description
   - Upload image (automatically optimized)
   - Add link (optional)
4. Click "Create Event"

### To Edit/Delete Events:
- Click "Edit" or "Delete" buttons on any event
- Changes are live immediately

## 📝 Managing Blog Posts

### To Create a Blog Post:
1. Go to Blog section
2. Click "Create New Post"
3. Fill in:
   - Title
   - Content (supports formatting)
   - Upload featured image
   - Author name
   - SEO details (optional)
4. Choose "Publish" or "Save as Draft"

### Formatting Options:
- **Bold**: Select text and click B
- **Italic**: Select text and click I
- **Headings**: Use the dropdown
- **Lists**: Click bullet or number icons
- **Links**: Select text and click link icon

## 🔧 Troubleshooting

### Can't Login?
1. Clear browser cookies
2. Try incognito/private mode
3. Check caps lock

### Images Not Uploading?
- Max size: 5MB
- Supported: JPEG, PNG, WebP
- Images are automatically optimized

### Changes Not Showing?
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache
3. Wait 30 seconds and refresh

### ✅ Data Persistence
- **Changes are now permanent** with Vercel KV storage
- All blog posts and events are automatically saved
- No need to worry about data loss or timeouts

## 📊 Performance Monitoring

The Performance Dashboard shows:
- ✅ **Green** = Everything is working
- ⚠️ **Yellow** = Minor issues (still working)
- ❌ **Red** = Needs attention

**What to check:**
- System Health status
- Recent errors (can be cleared)
- Memory usage

## 🚨 Emergency Contacts

### Website Issues:
1. Check Performance Dashboard first
2. Try logging out and back in
3. Contact your web developer

### Need to Change Password?
Contact your web developer to update in Vercel

## 💡 Pro Tips

1. **Save Often**: Click save/update buttons regularly
2. **Preview First**: Always preview before publishing
3. **Optimal Images**: 
   - Events: 1680x640px (landscape)
   - Blog: 1200x630px (landscape)
4. **SEO**: Fill in meta descriptions for better Google ranking

## 🔄 Regular Maintenance

Weekly:
- Check Performance Dashboard
- Clear old error logs if any

Monthly:
- Review and update old blog posts
- Remove past events
- Check all links still work

---
*Keep this guide handy for quick reference!*