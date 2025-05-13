'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  Search,
  Calendar,
  User,
  Home,
  X
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
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
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
    <div className="relative w-full py-32 flex items-center justify-center overflow-hidden bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-[#063f48]/80 via-[#063f48]/85 to-[#052b31]/90 backdrop-blur-sm z-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDIwIDIwIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwNjNmNDgiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjOGM2ZTM0IiBmaWxsLW9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] bg-repeat z-20 opacity-20" />
      <div className="relative z-30 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 bg-[#063f48]/50 backdrop-blur-md p-8 rounded-xl shadow-lg border border-[#C09E6C]/30"
        >
          <div className="inline-block mb-4">
            <div className="h-0.5 w-16 bg-[#C09E6C] mx-auto mb-4" />
            <h3 className="text-[#C09E6C] font-medium tracking-wider text-sm uppercase">Beauty Insights</h3>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-serif">Splendid Beauty Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover the latest beauty trends, expert tips, and professional advice from the Splendid Beauty team.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 relative max-w-xl mx-auto"
        >
          <div className="absolute inset-0 bg-black/20 rounded-full blur-md" />
          <form onSubmit={handleSearchSubmit} className="relative z-40 flex items-center">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full py-4 pl-5 pr-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C09E6C] focus:border-transparent shadow-inner-white/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#C09E6C] hover:text-white transition-colors"
              aria-label="Submit search"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const BlogPostCard: React.FC<{ post: BlogPost; featured?: boolean; priority?: boolean }> = React.memo(({ post, featured = false, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const imageAlt = post.imageAlt || `Image for ${post.title}`;

  return (
    <motion.div
      className={`group relative ${featured ? 'h-full' : 'flex flex-col'} rounded-2xl overflow-hidden shadow-xl bg-white/90 backdrop-blur-sm border border-white/20 aspect-[4/3]`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      initial={false} // Disable initial animation for cards themselves; FadeInView handles parent
    >
      <div className={`relative ${featured ? 'h-full' : 'h-56 sm:h-64'} w-full overflow-hidden`}>
        <Image
          src={post.featuredImage || '/images/placeholder-blog.webp'} // Fallback image
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          sizes={featured ? "(min-width: 1024px) 55vw, (min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          quality={featured ? 90 : 80}
          priority={priority} // Only high priority for LCP candidates
          loading={priority ? "eager" : "lazy"}
        />
        <div className={`absolute ${featured ? 'inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent' : 'top-4 left-4'}`}>
          {!featured && post.seo.keywords?.[0] && (
            <span className="inline-block py-1 px-3 rounded-full bg-[#8c6e34]/90 text-xs font-medium text-white shadow">
              {post.seo.keywords[0]}
            </span>
          )}
        </div>
        {featured && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            {post.seo.keywords?.[0] && (
              <span className="inline-block py-1 px-3 rounded-full bg-[#8c6e34]/90 text-xs font-medium text-white mb-3 shadow">
                {post.seo.keywords[0]}
              </span>
            )}
            <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-[#C09E6C] transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" />{formatDate(post.publishedAt)}</span>
              <span className="flex items-center"><User className="h-4 w-4 mr-1.5" />{post.author}</span>
            </div>
          </div>
        )}
      </div>

      {!featured && (
        <div className="p-5 md:p-6 flex-grow flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{formatDate(post.publishedAt)}</span>
            <span className="flex items-center"><User className="h-3 w-3 mr-1" />{post.author}</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900 group-hover:text-[#C09E6C] transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
          <div className="mt-auto">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-[#063f48] hover:text-[#C09E6C] font-medium text-sm transition-colors group/readmore"
              prefetch={false} // Prefetching can be aggressive, consider viewport-based prefetching if needed
            >
              Read More
              <motion.span className="ml-1" animate={isHovered ? { x: 4 } : { x: 0 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </div>
        </div>
      )}
      <Link href={`/blog/${post.slug}`} className="absolute inset-0" aria-label={`Read more about ${post.title}`} prefetch={false}>
        <span className="sr-only">Read article</span>
      </Link>
    </motion.div>
  );
});
BlogPostCard.displayName = 'BlogPostCard';


const FeaturedPosts: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <FadeInView className="flex items-center justify-between mb-10 md:mb-12 backdrop-blur-md bg-white/60 p-5 md:p-6 rounded-xl shadow-md border border-white/30">
        <div>
          <div className="h-0.5 w-12 bg-[#C09E6C] mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Articles</h2>
        </div>
        {/* Removed "View all articles" link here as search serves a similar purpose now */}
      </FadeInView>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">
        <FadeInView className="lg:col-span-7" delay={0.1}>
          <BlogPostCard post={posts[0]} featured priority />
        </FadeInView>
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 md:gap-10">
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
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto backdrop-blur-md bg-white/50 rounded-3xl mb-16 md:mb-20 shadow-lg border border-white/30">
      <FadeInView className="mb-10 md:mb-12">
        <div className="h-0.5 w-12 bg-[#C09E6C] mb-3" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Articles</h2>
      </FadeInView>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">
        {displayedPosts.map((post, index) => (
          <FadeInView key={post.id} delay={index * 0.05} className="h-full">
            <BlogPostCard post={post} />
          </FadeInView>
        ))}
      </div>
    </section>
  );
};

const Newsletter: React.FC = () => (
  <FadeInView className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16 md:mb-20">
    <div className="bg-gradient-to-br from-[#063f48] to-[#052b31] rounded-3xl overflow-hidden relative shadow-xl border border-[#C09E6C]/30">
      <div className="absolute inset-0 bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="relative z-10 px-6 py-12 md:px-8 md:py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">Stay Updated</h3>
            <p className="text-white/80 text-base lg:text-lg">Subscribe for exclusive beauty tips, product news, and the latest trends from Splendid Beauty.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:bg-white/10 sm:backdrop-blur-sm sm:p-1 sm:rounded-full">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 backdrop-blur-sm sm:bg-transparent flex-grow px-4 py-3 rounded-full sm:rounded-none text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C09E6C]"
              aria-label="Email for newsletter"
            />
            <button type="submit" className="bg-[#C09E6C] hover:bg-[#d4b988] text-[#063f48] px-5 py-3 rounded-full font-medium transition-colors text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  </FadeInView>
);

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
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

const PageFooter: React.FC = () => (
  <footer className="mt-16 md:mt-20 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <nav className="flex items-center justify-center">
        <Link href="/" className="inline-flex items-center text-[#063f48] hover:text-[#C09E6C] transition-colors font-medium gap-1.5 text-sm">
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </nav>
      <p className="text-center text-xs text-gray-500 mt-4">&copy; {new Date().getFullYear()} Splendid Beauty Bar & Co. All rights reserved.</p>
    </div>
  </footer>
);

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
      className="w-full overflow-x-hidden" // Changed overflow-y-auto to overflow-x-hidden as body handles scroll
    >
      <BackToTopButton />
      <BlogHero onSearch={handleSearch} initialQuery={initialSearchQuery} />

      {isSearching ? (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-10 backdrop-blur-md bg-white/60 p-5 md:p-6 rounded-xl shadow-md">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Search Results</h2>
              <p className="text-gray-600 text-sm">
                {filteredPosts.length} results found for "{currentSearchQuery}"
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentSearchQuery('');
                router.push(pathname, { scroll: false });
              }}
              className="text-[#063f48] hover:text-[#C09E6C] font-medium transition-colors text-sm"
            >
              Clear Search
            </button>
          </div>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">
              {filteredPosts.map((post, index) => (
                <FadeInView key={post.id} delay={index * 0.05} className="h-full">
                  <BlogPostCard post={post} />
                </FadeInView>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-600 mb-6 text-lg">No articles found matching your search.</p>
              <p className="text-gray-500 text-sm">Try different keywords or clear the search to see all posts.</p>
            </div>
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