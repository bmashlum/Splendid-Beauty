'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Calendar, User, Clock, Tag, Share2, Twitter, Facebook, Linkedin, BookOpen, Heart, MessageCircle, Sparkles } from 'lucide-react';
import MarkdownContent from '../../../components/MarkdownContent'; // Adjusted path

// Type for blog posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  author: string;
  publishedAt: string | null;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Date not available';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const estimateReadingTime = (content: string): string => {
  if (!content) return '0 min read';
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};


const ShareButtons: React.FC<{ title: string; url: string }> = React.memo(({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const shareActions = useMemo(() => [
    {
      label: 'Share on Twitter',
      Icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer'),
      bgColor: 'bg-[#1DA1F2]/10',
      hoverBgColor: 'hover:bg-[#1DA1F2]',
      iconColor: 'text-[#1DA1F2]',
      hoverIconColor: 'hover:text-white',
    },
    {
      label: 'Share on Facebook',
      Icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer'),
      bgColor: 'bg-[#1877F2]/10',
      hoverBgColor: 'hover:bg-[#1877F2]',
      iconColor: 'text-[#1877F2]',
      hoverIconColor: 'hover:text-white',
    },
    {
      label: 'Share on LinkedIn',
      Icon: Linkedin,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer'),
      bgColor: 'bg-[#0A66C2]/10',
      hoverBgColor: 'hover:bg-[#0A66C2]',
      iconColor: 'text-[#0A66C2]',
      hoverIconColor: 'hover:text-white',
    },
    {
      label: copied ? 'Link Copied!' : 'Copy Link',
      Icon: copied ? Heart : Share2,
      action: () => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
      bgColor: copied ? 'bg-green-500/10' : 'bg-gray-500/10',
      hoverBgColor: copied ? 'hover:bg-green-500' : 'hover:bg-gray-600',
      iconColor: copied ? 'text-green-500' : 'text-gray-600',
      hoverIconColor: 'hover:text-white',
    },
  ], [title, url, copied]);

  return (
    <div className="flex items-center gap-2">
      {shareActions.map(({ label, Icon, action, bgColor, hoverBgColor, iconColor, hoverIconColor }) => (
        <motion.button
          key={label}
          onClick={action}
          className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${bgColor} ${hoverBgColor} ${iconColor} ${hoverIconColor} transition-all duration-300 group`}
          aria-label={label}
          title={label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-5 w-5" />
        </motion.button>
      ))}
    </div>
  );
});
ShareButtons.displayName = 'ShareButtons';


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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter(); // For navigation
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  const slug = useMemo(() => params?.slug as string | undefined, [params?.slug]);

  useEffect(() => {
    // Ensure body scrolling is enabled for this page
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);


  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('Blog post slug is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Optimization: If an API endpoint /api/blog/slug/:slug exists, use it.
        // For now, using the provided method of fetching all and filtering.
        // This is highly inefficient for many posts and should be addressed with a dedicated API endpoint.
        const response = await fetch('/api/blog?status=published');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch blog posts: ${response.statusText}`);
        }

        const data = await response.json();
        const foundPost = data.posts?.find((p: BlogPost) => p.slug === slug);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Blog post not found. It may have been moved or unpublished.');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const shareUrl = useMemo(() => typeof window !== 'undefined' ? window.location.href : '', []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-t-[#063f48] border-r-[#063f48]/50 border-b-[#063f48]/50 border-l-[#063f48]/50 rounded-full"
        />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-50 to-white">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Post Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md">{error || "The blog post you're looking for doesn't exist or could not be loaded."}</p>
        <button
          onClick={() => router.push('/blog')}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-[#063f48] text-white hover:bg-[#052b31] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#063f48]"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Blog
        </button>
      </div>
    );
  }

  const imageSrc = imageError ? '/images/blog/default-beauty.jpg' : getLocalImagePath(post.slug);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30"
    >
      {/* Hero Section with Parallax */}
      <motion.div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover scale-110"
            priority
            quality={90}
            sizes="100vw"
            onError={() => setImageError(true)}
          />
        </motion.div>
        
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#063f48]/20 to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-10 lg:p-16">
            <div className="max-w-5xl mx-auto">
              {/* Category badge */}
              {post.seo.keywords?.[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2 bg-[#C09E6C] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    {post.seo.keywords[0]}
                  </span>
                </motion.div>
              )}
              
              {/* Title */}
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {post.title}
              </motion.h1>
              
              {/* Meta info */}
              <motion.div 
                className="flex flex-wrap items-center gap-6 text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {estimateReadingTime(post.content)}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative">
        {/* Floating social share sidebar */}
        <motion.div 
          className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-gray-200/50">
            <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Share</p>
            <div className="space-y-2">
              <ShareButtons title={post.title} url={shareUrl} />
            </div>
          </div>
        </motion.div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          {/* Article info card */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#063f48] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">Beauty Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {estimateReadingTime(post.content)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  234 likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  12 comments
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Main article content */}
          <article className="prose prose-lg max-w-none mb-12 md:mb-16">
            <MarkdownContent content={post.content} />
          </article>

          {/* Tags section */}
          {post.seo.keywords && post.seo.keywords.length > 0 && (
            <motion.div 
              className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-[#C09E6C]" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.seo.keywords.map((keyword) => (
                  <motion.span 
                    key={keyword} 
                    className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm hover:bg-[#C09E6C] hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share section for mobile */}
          <div className="lg:hidden bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this article</h3>
            <ShareButtons title={post.title} url={shareUrl} />
          </div>

          {/* Newsletter CTA */}
          <motion.div 
            className="bg-gradient-to-br from-[#063f48] to-[#052b31] rounded-2xl p-8 md:p-12 text-white text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Heart className="w-12 h-12 text-[#C09E6C] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Enjoyed this article?</h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter for more beauty tips and exclusive content delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-3 bg-[#C09E6C] hover:bg-[#d4b988] text-[#063f48] rounded-full font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#063f48] hover:text-[#C09E6C] transition-colors font-medium group"
            >
              <ChevronLeft className="h-5 w-5 mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
            
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#063f48] hover:bg-[#052b31] text-white rounded-full font-medium transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
              <ChevronLeft className="h-4 w-4 rotate-90" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}