'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  Search,
  Calendar,
  User,
  Home,
  X,
  Clock,
  Sparkles,
  TrendingUp,
  BookOpen,
  Heart,
  Share2,
  Instagram,
  Globe,
  Mail
} from 'lucide-react';

// Type for blog posts (ensure this matches your actual type structure)
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Used for search, not displayed on card
  featuredImage: string;
  imageAlt: string;
  author: string;
  publishedAt: string | null;
  status: 'draft' | 'published'; // Ensure this is part of your type if used
  createdAt: string;
  updatedAt: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const FadeInView: React.FC<{ children: React.ReactNode; delay?: number; duration?: number; className?: string; once?: boolean; amount?: number; }> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  once = true,
  amount = 0.2
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Not published';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (error) {
    console.warn("Error formatting date:", dateString, error);
    return dateString;
  }
};

const BlogHero: React.FC<{ onSearch: (query: string) => void; initialQuery?: string }> = ({ onSearch, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
    router.push(`${pathname}?search=${encodeURIComponent(searchQuery.trim())}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    router.push(pathname, { scroll: false });
  };

  return (
    <motion.div className="relative w-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Enhanced gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#063f48] via-[#063f48]/95 to-[#052b31]" />
      
      {/* Animated geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0MwOUU2QyIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] fixed" />
      </div>
      
      {/* Static golden accents - no animation for better performance */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#C09E6C]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C09E6C]/5 rounded-full blur-2xl" />
      
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Static sparkle icon - no rotation for better performance */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[#C09E6C]/20 border border-[#C09E6C]/30">
            <Sparkles className="w-8 h-8 text-[#C09E6C]" />
          </div>
          
          <div className="space-y-2 mb-4">
            <motion.div 
              className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C09E6C] to-transparent mx-auto"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <h3 className="text-[#C09E6C] font-medium tracking-[0.2em] text-sm uppercase">Beauty Insights & Expertise</h3>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 font-serif leading-tight">
            <span className="inline-block">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent"
              >
                Splendid Beauty
              </motion.span>
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[#C09E6C] text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
            >
              Blog & Journal
            </motion.span>
          </h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover transformative beauty insights, expert skincare advice, and the latest trends 
            from our team of professional aestheticians and beauty specialists.
          </motion.p>
        </motion.div>
        
        {/* Enhanced search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#C09E6C]/20 via-[#C09E6C]/10 to-[#C09E6C]/20 rounded-full blur-xl" />
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search beauty tips, skincare routines, trends..."
                className="w-full py-4 pl-6 pr-14 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#C09E6C]/50 focus:border-[#C09E6C]/50 focus:bg-white/15 transition-all duration-300 text-base group-hover:bg-white/15"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blog articles"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                <button
                  type="submit"
                  className="p-2.5 bg-[#C09E6C] hover:bg-[#d4b988] text-[#063f48] rounded-full transition-all duration-300 transform hover:scale-105"
                  aria-label="Submit search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
          
          {/* Popular search tags */}
          <motion.div 
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <span className="text-white/50 text-sm">Popular:</span>
            {['Skincare', 'Facials', 'Anti-aging', 'Natural Beauty'].map((tag, index) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
                }}
                className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Helper function to get local image path
const getLocalImagePath = (slug: string) => {
  const imageMap: { [key: string]: string } = {
    'essential-skincare-routine': '/images/blog/skincare-routine.svg',
    'hair-care-tips': '/images/blog/hair-care.svg',
    'makeup-trends-2024': '/images/blog/makeup-trends.svg',
    'natural-hair-care': '/images/blog/natural-hair.svg',
    'sustainable-beauty': '/images/blog/sustainable-beauty.svg',
    'brow-styling-techniques': '/images/blog/brow-styling.svg',
    'facial-treatments-guide': '/images/blog/facial-treatments.svg',
    'natural-beauty-ingredients': '/images/blog/natural-ingredients.svg',
    'nail-art-trends': '/images/blog/nail-art.svg',
    'chemical-peels-explained': '/images/blog/chemical-peels.svg',
    'sustainable-beauty-practices': '/images/blog/sustainable-practices.svg',
  };
  return imageMap[slug] || '/images/blog/default-beauty.svg';
};

const BlogPostCard: React.FC<{ post: BlogPost; featured?: boolean; priority?: boolean }> = React.memo(({ post, featured = false, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageAlt = post.imageAlt || `Image for ${post.title}`;
  const imageSrc = imageError ? '/images/blog/default-beauty.jpg' : getLocalImagePath(post.slug);

  return (
    <div
      className={`group relative ${featured ? 'h-full' : ''} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative ${featured ? 'h-full min-h-[400px]' : 'h-full'} bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300`}>
        {/* Enhanced gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 z-10 pointer-events-none" />
        
        <div className={`relative ${featured ? 'h-full' : 'h-48 sm:h-56'} w-full overflow-hidden bg-gray-100`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes={featured ? "(min-width: 1024px) 55vw, (min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            quality={featured ? 90 : 85}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onError={() => setImageError(true)}
          />
          
          {/* Enhanced gradient overlay for featured cards */}
          {featured && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          )}
          
          {/* Category badge */}
          <div className={`absolute ${featured ? 'top-6 left-6' : 'top-4 left-4'} z-20`}>
            {post.seo.keywords?.[0] && (
              <motion.span 
                className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full ${featured ? 'bg-[#C09E6C]' : 'bg-[#C09E6C]/90'} text-xs font-medium text-white shadow-lg backdrop-blur-sm`}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-3 h-3" />
                {post.seo.keywords[0]}
              </motion.span>
            )}
          </div>
          
          {/* Featured content overlay */}
          {featured && (
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-20">
              <motion.h3 
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {post.title}
              </motion.h3>
              <motion.p 
                className="text-white/80 text-base md:text-lg mb-4 line-clamp-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {post.excerpt}
              </motion.p>
              <motion.div 
                className="flex items-center gap-4 text-white/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  5 min read
                </span>
              </motion.div>
            </div>
          )}
        </div>

        {!featured && (
          <div className="p-5 md:p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                5 min read
              </span>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 group-hover:text-[#C09E6C] transition-colors duration-300 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author}
              </span>
              
              <motion.div
                className="inline-flex items-center gap-1.5 text-[#C09E6C] font-medium text-sm group/readmore"
                whileHover={{ x: 3 }}
              >
                <span>Read More</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/readmore:translate-x-1" />
              </motion.div>
            </div>
          </div>
        )}
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#C09E6C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      <Link 
        href={`/blog/${post.slug}`} 
        className="absolute inset-0 z-30" 
        aria-label={`Read more about ${post.title}`}
        prefetch={false}
      >
        <span className="sr-only">Read article</span>
      </Link>
    </div>
  );
});
BlogPostCard.displayName = 'BlogPostCard';


const FeaturedPosts: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeInView className="mb-12">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-[#C09E6C]/10 border border-[#C09E6C]/30"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <TrendingUp className="w-7 h-7 text-[#C09E6C]" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Featured Articles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our most popular beauty insights and expert recommendations</p>
        </div>
      </FadeInView>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <FadeInView className="lg:col-span-8" delay={0.1}>
          <BlogPostCard post={posts[0]} featured priority />
        </FadeInView>
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {posts.slice(1, 3).map((post, index) => (
            <FadeInView key={post.id} delay={0.2 + index * 0.1}>
              <BlogPostCard post={post} priority={index === 0} />
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

const LatestPosts: React.FC<{ posts: BlogPost[]; postsToShow?: number }> = ({ posts, postsToShow = 6 }) => {
  if (!posts || posts.length === 0) return null;

  const displayedPosts = posts.slice(0, postsToShow);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeInView className="mb-12">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-full bg-[#063f48]/10 border border-[#063f48]/30"
              whileHover={{ scale: 1.1, rotate: -180 }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="w-7 h-7 text-[#063f48]" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Latest Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with fresh beauty content and industry insights</p>
          </div>
        </FadeInView>
        
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#C09E6C]/5 via-transparent to-[#C09E6C]/5 rounded-3xl blur-2xl" />
          
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedPosts.map((post, index) => (
              <FadeInView key={post.id} delay={index * 0.08} className="h-full">
                <BlogPostCard post={post} />
              </FadeInView>
            ))}
          </div>
        </div>
        
        {posts.length > postsToShow && (
          <FadeInView className="mt-12 text-center">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#063f48] hover:bg-[#052b31] text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* Add view more functionality */}}
            >
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </FadeInView>
        )}
      </div>
    </section>
  );
};

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter signup logic here
    console.log('Newsletter signup:', email);
  };
  
  return (
    <FadeInView className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        className="relative overflow-hidden rounded-3xl"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#063f48] via-[#063f48]/95 to-[#052b31]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C09E6C]/20 via-transparent to-[#C09E6C]/10" />
        
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI0MwOUU2QyIgb3BhY2l0eT0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] fixed" />
        </div>
        
        {/* Static accent circle */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C09E6C]/20 rounded-full blur-2xl opacity-25" />
        
        <div className="relative z-10 px-6 py-16 md:px-12 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/10 border border-white/20">
                <Heart className="w-8 h-8 text-[#C09E6C]" />
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Join Our Beauty Community
              </h3>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Get exclusive access to professional beauty tips, special offers, and be the first to know about our latest treatments and events.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-[#C09E6C]/30 to-[#C09E6C]/10 rounded-full blur-xl"
                  animate={{ opacity: isHovered ? 0.8 : 0.5 }}
                />
                
                <div 
                  className="relative flex flex-col sm:flex-row gap-3 sm:gap-0 sm:bg-white/10 sm:backdrop-blur-md sm:p-1.5 sm:rounded-full sm:border sm:border-white/20"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-white/10 backdrop-blur-sm sm:bg-transparent flex-grow px-6 py-4 rounded-full sm:rounded-l-full text-white placeholder-white/50 focus:outline-none focus:bg-white/15 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email for newsletter"
                  />
                  <motion.button 
                    type="submit" 
                    className="bg-[#C09E6C] hover:bg-[#d4b988] text-[#063f48] px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe Now
                  </motion.button>
                </div>
              </div>
              
              <p className="text-center text-white/50 text-sm mt-4">
                Join 10,000+ beauty enthusiasts. No spam, unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </FadeInView>
  );
};

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    let ticking = false;
    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#063f48] text-white h-12 w-12 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-[#052b31] transition-colors group ring-1 ring-[#C09E6C]/50 hover:ring-[#C09E6C]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <ChevronLeft className="h-6 w-6 transform rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const PageFooter: React.FC = () => {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Globe, href: '#', label: 'Website' },
    { icon: Mail, href: '#', label: 'Email' },
  ];
  
  return (
    <footer className="mt-20 border-t border-gray-200/30 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Splendid Beauty</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted partner in beauty and wellness since 2020.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-gray-600 hover:text-[#C09E6C] transition-colors">
                Home
              </Link>
              <Link href="/blog" className="block text-sm text-gray-600 hover:text-[#C09E6C] transition-colors">
                Blog
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 hover:text-[#C09E6C] transition-colors">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Follow Us</h4>
            <div className="flex items-center justify-center md:justify-end gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-[#C09E6C] text-gray-600 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Splendid Beauty Bar & Co. All rights reserved.
            </p>
            <nav className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#C09E6C] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-[#C09E6C] transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BlogContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialSearchQuery = useMemo(() => searchParams?.get('search') || '', [searchParams]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/blog?status=published'); // Only fetch published posts
        if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
        const data = await response.json();
        setAllPosts(data.posts || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    // Sync URL search param with local state if URL changes (e.g. back/forward browser buttons)
    const searchFromUrl = searchParams?.get('search') || '';
    if (searchFromUrl !== currentSearchQuery) {
      setCurrentSearchQuery(searchFromUrl);
    }
  }, [searchParams, currentSearchQuery]);

  const handleSearch = useCallback((query: string) => {
    setCurrentSearchQuery(query);
    // URL update is handled by BlogHero form submission
  }, []);

  const filteredPosts = useMemo(() => {
    if (!currentSearchQuery) return allPosts;
    const lowercasedQuery = currentSearchQuery.toLowerCase();
    return allPosts.filter(post =>
      post.title.toLowerCase().includes(lowercasedQuery) ||
      post.excerpt.toLowerCase().includes(lowercasedQuery) ||
      post.content.toLowerCase().includes(lowercasedQuery) || // Search content too
      post.author.toLowerCase().includes(lowercasedQuery) ||
      post.seo.keywords?.some(kw => kw.toLowerCase().includes(lowercasedQuery))
    );
  }, [allPosts, currentSearchQuery]);

  const featuredDisplayPosts = useMemo(() => filteredPosts.slice(0, 3), [filteredPosts]);
  const latestDisplayPosts = useMemo(() => {
    // If searching, show all results. Otherwise, show a slice of latest.
    return currentSearchQuery ? filteredPosts : filteredPosts.slice(0, 6);
  }, [filteredPosts, currentSearchQuery]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]"> {/* Adjust min-height */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-t-[#063f48] border-r-[#063f48]/50 border-b-[#063f48]/50 border-l-[#063f48]/50 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#063f48] text-white px-6 py-2 rounded-md hover:bg-[#052b31] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isSearching = !!currentSearchQuery;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30"
    >
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjMDAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>
      
      <BackToTopButton />
      <BlogHero onSearch={handleSearch} initialQuery={initialSearchQuery} />

      {isSearching ? (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Search Results</h2>
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-[#C09E6C]">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'} for <span className="font-semibold">"{currentSearchQuery}"</span>
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    setCurrentSearchQuery('');
                    router.push(pathname, { scroll: false });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                  Clear Search
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredPosts.map((post, index) => (
                <FadeInView key={post.id} delay={index * 0.08} className="h-full">
                  <BlogPostCard post={post} />
                </FadeInView>
              ))}
            </div>
          ) : (
            <motion.div 
              className="py-20 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">No articles found</h3>
                <p className="text-gray-500 mb-8">We couldn't find any articles matching your search. Try different keywords or browse all our content.</p>
                <motion.button
                  onClick={() => {
                    setCurrentSearchQuery('');
                    router.push(pathname, { scroll: false });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#063f48] hover:bg-[#052b31] text-white rounded-full font-medium transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  View All Articles
                </motion.button>
              </div>
            </motion.div>
          )}
        </section>
      ) : (
        <>
          {featuredDisplayPosts.length > 0 && <FeaturedPosts posts={featuredDisplayPosts} />}
          {latestDisplayPosts.length > 0 && <LatestPosts posts={latestDisplayPosts} />}
          {allPosts.length === 0 && !isLoading && ( // Show if no posts at all and not loading/error
            <div className="py-20 text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Blog Posts Yet</h2>
              <p className="text-gray-500">Check back soon for exciting updates and articles!</p>
            </div>
          )}
        </>
      )}
      <Newsletter />
      <PageFooter />
    </motion.div>
  );
};

export default function BlogPage() {
  // useEffect to ensure body scrolling is enabled
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      // Optional: Reset on unmount if needed, but typically not for page components
      // document.body.style.overflow = '';
      // document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <Suspense fallback={ // Full page suspense fallback, though BlogContent has its own
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-t-[#063f48] border-r-[#063f48]/50 border-b-[#063f48]/50 border-l-[#063f48]/50 rounded-full"
        />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}