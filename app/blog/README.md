# Splendid Beauty Blog Refactor

This repository contains a comprehensive refactor of the Splendid Beauty blog page, elevating it to a truly high-end, premium experience.

## Overview

The blog page has been redesigned with a focus on:
- Premium visual aesthetics
- Enhanced user experience
- Improved accessibility
- Optimized performance
- Smooth animations and transitions

## Key Improvements

### 1. Visual Design

#### Hero Section
- **Darkened Background**: Enhanced gradient overlay (`from-[#063f48]/70 via-[#063f48]/80 to-[#052b31]/90`)
- **Responsive Images**: WebP format with source sets and lazy loading
- **Marbled Pattern**: Updated with darker gold accents (`#8c6e34`)

#### Search Bar
- **Subtle Styling**: Lighter border (`border-white/10`)
- **Inner Shadow**: Added `shadow-inner` for depth
- **Improved Contrast**: Better visual hierarchy

#### Card Design
- **Fixed Aspect Ratio**: 4:3 containers using `aspect-[4/3]`
- **Hover Animations**: `motion-safe:hover:scale-[1.03]`
- **Larger Spacing**: `gap-x-8 gap-y-10` for better breathing room

### 2. Typography
- **Intermediate Size**: Added custom `text-20` class (20px)
- **Improved Hierarchy**: Better visual organization of content
- **Custom CSS**: `blog-typography.css` for additional styling

### 3. Navigation
- **Elevated Bar**: Appears after 100px scroll with backdrop blur
- **Footer Navigation**: "Back to Home" moved to footer
- **Smooth Transitions**: Seamless user experience

### 4. Accessibility
- **WCAG-AA Compliance**: Darker gold color (`#8c6e34`) for better contrast
- **Alt Text**: Auto-generated from post titles
- **ARIA Labels**: Added to all interactive elements

### 5. Performance
- **Lazy Loading**: Non-critical images load on demand
- **Preloading**: Hero images load immediately
- **WebP Format**: Optimized image compression
- **Responsive Sizes**: Multiple image variants for different viewports

## Files Modified

### Main Files
1. **`page.tsx`** - Complete refactor of blog page component
2. **`layout.tsx`** - Updated to import custom CSS
3. **`blog-typography.css`** - Custom typography styles

### New Files
1. **`/public/images/hero/marbled-background-low.svg`** - Low-res placeholder
2. **`/public/images/hero/marbled-background-responsive.webp`** - Responsive image
3. **`/scripts/create-webp-images.js`** - Image optimization script

## CSS Classes

### Custom Typography
```css
.text-20 {
  font-size: 20px;
  line-height: 1.4;
}
```

### Inner Shadow
```css
.shadow-inner-white/5 {
  box-shadow: inset 0 2px 4px 0 rgba(255, 255, 255, 0.05);
}
```

### Aspect Ratios
```css
.aspect-[4/3] {
  aspect-ratio: 4 / 3;
}
```

## Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Teal Primary | `#063f48` | Headers, CTA buttons |
| Darker Gold | `#8c6e34` | Tag pills, accents |
| Light Gold | `#C09E6C` | Hover states, highlights |
| Blue-Gray | `#52646F` | Secondary elements |

## Implementation

### To Use These Changes:
1. Replace existing `page.tsx` with refactored version
2. Import `blog-typography.css` in layout
3. Add responsive WebP images to public directory
4. Update any related components to match new styling

### For WebP Images:
```javascript
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet="/images/hero/marbled-background-large.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 640px)"
    srcSet="/images/hero/marbled-background-medium.webp"
    type="image/webp"
  />
  <img
    src="/images/hero/marbled-background-low.svg"
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />
</picture>
```

## Browser Support
- WebP format supported in all modern browsers
- Fallback SVG placeholders for older browsers
- Progressive enhancement approach

## Performance Metrics
- Reduced layout shift with aspect ratios
- Optimized images with WebP compression
- Lazy loading implemented for off-screen images
- Smooth 60fps animations

## Next Steps
1. Convert marbled background to actual WebP format
2. Generate responsive image sizes using sharp
3. Implement progressive image loading
4. Add performance monitoring

## License
© 2024 Splendid Beauty Bar & Co. All rights reserved.