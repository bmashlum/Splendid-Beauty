'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  X,
  Check,
  Info,
  ArrowLeft,
  // Tag, // Not used in this component
  User,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns' // Removed 'parse' as it's not used here
import ImageUploadField from '@/components/ImageUploadField'
import SEOGenerator from '@/components/SEOGenerator'
import TextToMarkdownConverter from '@/components/TextToMarkdownConverter'

// Types for our blog posts
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

type ViewMode = 'list' | 'editor';
type StatusFilter = 'all' | 'draft' | 'published';

interface FormDataState {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  status: 'draft' | 'published';
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const initialFormData: FormDataState = {
  id: '',
  title: '',
  content: '',
  excerpt: '',
  author: 'Splendid Beauty Team', // Default author
  status: 'draft',
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
};

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isEditing, setIsEditing] = useState(false)
  // selectedPost is implicitly handled by formData.id when editing
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false })

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const response = await fetch(`/api/blog${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog posts')
      }
      setPosts(data.posts || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      showToast(errorMessage, 'error');
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, showToast]);

  useEffect(() => {
    if (viewMode === 'list') {
      fetchPosts();
    }
  }, [viewMode, fetchPosts]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, []);

  const resetFormAndState = useCallback(() => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview('');
    setIsEditing(false);
  }, []);

  const handleAddPost = useCallback(() => {
    resetFormAndState();
    setFormData(prev => ({ ...prev, author: 'Splendid Beauty Team' })); // Ensure default author
    setViewMode('editor');
  }, [resetFormAndState]);

  const handleEditPost = useCallback((post: BlogPost) => {
    setFormData({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      status: post.status,
      imageAlt: post.imageAlt,
      metaTitle: post.seo.metaTitle || '',
      metaDescription: post.seo.metaDescription || '',
      keywords: post.seo.keywords?.join(', ') || ''
    });
    setImageFile(null);
    setImagePreview(post.featuredImage);
    setIsEditing(true);
    setViewMode('editor');
  }, []);

  const handleBackToList = useCallback(() => {
    resetFormAndState();
    setViewMode('list');
  }, [resetFormAndState]);

  const handleDeletePost = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete blog post');
      }
      setPosts(prev => prev.filter(post => post.id !== id));
      showToast('Blog post deleted successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error deleting blog post:', err);
    }
  }, [showToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and Content are required fields.', 'error');
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'id' && !isEditing) return; // Don't append ID for new posts
      submitData.append(key, value);
    });
    if (imageFile) submitData.append('image', imageFile);

    try {
      const response = await fetch('/api/blog', {
        method: isEditing ? 'PUT' : 'POST',
        body: submitData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save blog post');
      }

      showToast(`Blog post ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
      handleBackToList(); // This will trigger fetchPosts via useEffect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error saving blog post:', err);
    }
  }, [formData, imageFile, isEditing, showToast, handleBackToList]);

  const handleViewPost = useCallback((slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  }, []);

  const handleMarkdownConversion = useCallback((markdown: string) => {
    setFormData(prev => ({ ...prev, content: markdown }));
    showToast('Content converted to Markdown!', 'success');
  }, [showToast]);

  const handleSEOGenerate = useCallback((metaTitle: string, metaDescription: string) => {
    setFormData(prev => ({ ...prev, metaTitle, metaDescription }));
    showToast('SEO content generated successfully!', 'success');
  }, [showToast]);

  const formatDateDisplay = useCallback((dateString: string | null) => {
    if (!dateString) return 'Not published';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      console.warn("Failed to format date:", dateString, error);
      return dateString; // Fallback to original string if formatting fails
    }
  }, []);

  const filteredPosts = useMemo(() => {
    if (statusFilter === 'all') return posts;
    return posts.filter(post => post.status === statusFilter);
  }, [posts, statusFilter]);

  const editorTitle = useMemo(() => (isEditing ? 'Edit Blog Post' : 'Create Blog Post'), [isEditing]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        {viewMode === 'list' ? (
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Manage Blog Posts</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48]"
              aria-label="Filter posts by status"
            >
              <option value="all">All Posts</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{editorTitle}</h1>
          </div>
        )}
        {viewMode === 'list' && (
          <button
            onClick={handleAddPost}
            className="inline-flex items-center gap-2 rounded-md bg-[#063f48] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            New Blog Post
          </button>
        )}
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#063f48]" />
            </div>
          ) : error && !posts.length ? ( // Show general error if posts array is empty
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0"><Info className="h-5 w-5 text-red-400" /></div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
                </div>
              </div>
            </div>
          ) : !filteredPosts.length ? (
            <div className="rounded-md bg-gray-50 p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {statusFilter === 'all' ? 'No blog posts yet' : `No ${statusFilter} posts`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter === 'all' ? 'Get started by creating your first blog post.' : `There are no posts matching the filter "${statusFilter}".`}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddPost}
                  className="inline-flex items-center rounded-md bg-[#063f48] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Blog Post
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <li key={post.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                          {post.featuredImage && (
                            <div className="h-12 w-16 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={post.featuredImage}
                                alt={post.imageAlt || post.title}
                                width={64}
                                height={48}
                                className="h-full w-full object-cover"
                                quality={75}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#063f48] truncate">
                              {post.title}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateDisplay(post.publishedAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                  }`}
                              >
                                {post.status === 'published' ? (
                                  <Eye className="h-3 w-3 mr-1" />
                                ) : (
                                  <EyeOff className="h-3 w-3 mr-1" />
                                )}
                                {post.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                          {post.status === 'published' && (
                            <button
                              onClick={() => handleViewPost(post.slug)}
                              className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
                              title="View Post"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View Post</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleEditPost(post)}
                            className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
                            title="Edit Post"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Post</span>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            title="Delete Post"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Post</span>
                          </button>
                        </div>
                      </div>
                      {post.excerpt && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main content column */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                    placeholder="Enter your blog post title"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Content *
                    </label>
                    <TextToMarkdownConverter
                      content={formData.content}
                      onConvert={handleMarkdownConversion}
                    />
                  </div>
                  <textarea
                    name="content"
                    id="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                    placeholder="Write your blog content here. Use Markdown formatting."
                  />
                </div>

                <div>
                  <label
                    htmlFor="excerpt"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    id="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                    placeholder="Brief summary of your post (optional, auto-generated if empty)"
                  />
                </div>
              </div>

              {/* Sidebar column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Publish Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                      <input
                        type="text"
                        name="author"
                        id="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                        placeholder="Author name"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Featured Image</h3>
                  <ImageUploadField
                    imagePreview={imagePreview}
                    isEditing={isEditing}
                    onChange={handleImageChange}
                  />
                  <div className="mt-4">
                    <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700">Image Alt Text</label>
                    <input
                      type="text"
                      name="imageAlt"
                      id="imageAlt"
                      value={formData.imageAlt}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                      placeholder="Describe the image (auto-generated if empty)"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">SEO Settings</h3>
                    <SEOGenerator
                      title={formData.title}
                      content={formData.content}
                      excerpt={formData.excerpt}
                      onGenerate={handleSEOGenerate}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        id="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                        placeholder="SEO title (auto-generated if empty)"
                      />
                    </div>
                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Description</label>
                      <textarea
                        name="metaDescription"
                        id="metaDescription"
                        rows={3}
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                        placeholder="SEO description (auto-generated if empty)"
                      />
                    </div>
                    <div>
                      <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
                      <input
                        type="text"
                        name="keywords"
                        id="keywords"
                        value={formData.keywords}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#063f48] focus:outline-none focus:ring-1 focus:ring-[#063f48] sm:text-sm"
                        placeholder="keywords, separated, by, commas"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBackToList}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-[#063f48] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
              >
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 z-[101] admin-toast">
          <div
            className={`rounded-md ${toast.type === 'success' ? 'bg-green-50' : 'bg-red-50'} p-4 shadow-lg`}
            role={toast.type === 'error' ? 'alert' : 'status'}
            aria-live="assertive"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <X className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {toast.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                    className={`inline-flex rounded-md p-1.5 ${toast.type === 'success'
                      ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:bg-green-100'
                      : 'bg-red-50 text-red-500 hover:bg-red-100 focus:bg-red-100'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${toast.type === 'success' ? 'focus:ring-offset-green-50 focus:ring-green-600' : 'focus:ring-offset-red-50 focus:ring-red-600'}`}
                    aria-label="Dismiss notification"
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}