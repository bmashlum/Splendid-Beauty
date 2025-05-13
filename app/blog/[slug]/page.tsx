'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, Clock, Tag, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
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
      bgColor: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#1A8CD8]',
    },
    {
      label: 'Share on Facebook',
      Icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer'),
      bgColor: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#166FE5]',
    },
    {
      label: 'Share on LinkedIn',
      Icon: Linkedin,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer'),
      bgColor: 'bg-[#0A66C2]',
      hoverColor: 'hover:bg-[#004182]',
    },
    {
      label: copied ? 'Link Copied!' : 'Copy Link',
      Icon: Share2,
      action: () => {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
      bgColor: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
    },
  ], [title, url, copied]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {shareActions.map(({ label, Icon, action, bgColor, hoverColor }) => (
        <button
          key={label}
          onClick={action}
          className={`inline-flex items-center justify-center h-10 w-10 rounded-full text-white ${bgColor} ${hoverColor} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current`}
          aria-label={label}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
});
ShareButtons.displayName = 'ShareButtons';


export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter(); // For navigation
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white/50" // Subtle gradient
    >
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[65vh] overflow-hidden group">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority
            quality={90}
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12 text-white max-w-5xl mx-auto">
          {post.seo.keywords?.[0] && (
            <span className="inline-block bg-[#C09E6C]/90 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 shadow">
              {post.seo.keywords[0]}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 line-clamp-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base text-white/90">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{estimateReadingTime(post.content)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <article className="mb-12 md:mb-16">
          <MarkdownContent content={post.content} />
        </article>

        {post.seo.keywords && post.seo.keywords.length > 0 && (
          <div className="mb-10 md:mb-12">
            <h3 className="text-base font-semibold text-gray-600 mb-3 flex items-center">
              <Tag className="h-4 w-4 mr-2 text-[#C09E6C]" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.seo.keywords.map((keyword) => (
                <span key={keyword} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-8 md:pt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this article</h3>
          <ShareButtons title={post.title} url={shareUrl} />
        </div>

        <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8 md:pt-10">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#063f48] hover:text-[#C09E6C] transition-colors font-medium group"
          >
            <ChevronLeft className="h-5 w-5 mr-1.5 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>
      </div>
    </motion.div>
  );
}