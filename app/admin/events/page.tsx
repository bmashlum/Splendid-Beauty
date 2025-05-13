'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import {
  Pencil,
  Trash2,
  Plus,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
  Info,
  HelpCircle
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import ImageUploadField from '@/components/ImageUploadField'

// Types for our events
interface Event {
  id: string;
  title: string;
  date: string; // Stored as "yyyy-MM-dd" for input, displayed as "MMMM d, yyyy"
  description: string;
  excerpt?: string;
  imageSrc: string;
  imageAlt: string;
  link: string;
  imagePosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectFit?: 'cover' | 'contain';
  createdAt: string;
  updatedAt: string;
}

interface FormDataState {
  id: string;
  title: string;
  date: string; // Always "yyyy-MM-dd"
  description: string;
  excerpt: string;
  link: string;
  imageAlt: string;
  imagePosition: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectFit: 'cover' | 'contain';
}

const initialFormData: FormDataState = {
  id: '',
  title: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  description: '',
  excerpt: '',
  link: '',
  imageAlt: '',
  imagePosition: 'center',
  objectFit: 'cover',
};

interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [formData, setFormData] = useState<FormDataState>(initialFormData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [shouldUpdateImage, setShouldUpdateImage] = useState(false)
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false })

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch events');
      setEvents(data.events || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      showToast(msg, 'error');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setShouldUpdateImage(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImageFile(null);
    setImagePreview('');
    setShouldUpdateImage(true); // Important for edit mode to signal image removal
  }, []);
  
  const resetFormAndModal = useCallback(() => {
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview('');
    setShouldUpdateImage(false);
    setIsEditing(false);
    setShowModal(false);
  }, []);

  const handleAddEvent = useCallback(() => {
    resetFormAndModal();
    setFormData(prev => ({ ...prev, date: format(new Date(), 'yyyy-MM-dd') })); // Ensure date is current
    setShowModal(true);
  }, [resetFormAndModal]);

  const handleEditEvent = useCallback((event: Event) => {
    let inputDate = event.date; // Assume it's "yyyy-MM-dd" from API or previously formatted
    // If date is in "MMMM d, yyyy" format, try to parse and reformat
    // This is a safeguard; ideally, API sends consistent "yyyy-MM-dd" for `event.date`
    try {
        const parsedApiDate = parseISO(event.date); // If API sends ISO string
        if (isValid(parsedApiDate)) {
            inputDate = format(parsedApiDate, 'yyyy-MM-dd');
        } else {
            // Try parsing "MMMM d, yyyy" if API might send that
            const parsedDisplayDate = new Date(event.date); // More robust than date-fns parse for display formats
            if (isValid(parsedDisplayDate)) {
               inputDate = format(parsedDisplayDate, 'yyyy-MM-dd');
            }
        }
    } catch (e) { console.warn(`Could not parse date ${event.date} for editing, using as is.`); }


    setFormData({
      id: event.id,
      title: event.title,
      date: inputDate,
      description: event.description,
      excerpt: event.excerpt || '',
      link: event.link,
      imageAlt: event.imageAlt,
      imagePosition: event.imagePosition || 'center',
      objectFit: event.objectFit || 'cover',
    });
    setImageFile(null);
    setImagePreview(event.imageSrc);
    setShouldUpdateImage(false);
    setIsEditing(true);
    setShowModal(true);
  }, []);

  const handleDeleteEvent = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const response = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete event');
      }
      setEvents(prev => prev.filter(event => event.id !== id));
      showToast('Event deleted successfully!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      showToast(msg, 'error');
      console.error('Error deleting event:', err);
    }
  }, [showToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.description.trim()) {
      showToast('Title, Date, and Description are required.', 'error');
      return;
    }
    if (!isEditing && !imageFile) {
      showToast('Please select an image for new events.', 'error');
      return;
    }

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'id' && !isEditing) return;
      submitData.append(key, value);
    });
    
    // Auto-generate excerpt if empty
    const excerptToSave = formData.excerpt.trim() || 
      (formData.description.length > 140 
        ? formData.description.slice(0, 137) + '...' 
        : formData.description);
    submitData.set('excerpt', excerptToSave); // Use .set to override if 'excerpt' was already appended

    // Auto-generate imageAlt if empty
    const imageAltToSave = formData.imageAlt.trim() || formData.title;
    submitData.set('imageAlt', imageAltToSave);


    if (imageFile) {
      submitData.append('image', imageFile);
    } else if (isEditing && shouldUpdateImage && !imagePreview) {
      // Signal to backend that image should be removed or handled if it supports nullification
      submitData.append('removeImage', 'true'); 
    }


    try {
      const response = await fetch('/api/events', {
        method: isEditing ? 'PUT' : 'POST',
        body: submitData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save event');
      
      showToast(`Event ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
      fetchEvents(); // Re-fetch all events to get the latest list
      resetFormAndModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(msg);
      showToast(msg, 'error');
      console.error('Error saving event:', err);
    }
  }, [formData, imageFile, isEditing, shouldUpdateImage, imagePreview, showToast, fetchEvents, resetFormAndModal]);

  // Helper function to format date for display on cards
  const formatDateForDisplay = useCallback((dateString: string): string => {
    // Date string is expected to be "yyyy-MM-dd" from form or API after normalization
    try {
      const dateParts = dateString.split('-');
      if (dateParts.length === 3) {
        // Construct date as UTC to avoid timezone issues with `new Date()`
        const date = new Date(Date.UTC(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])));
        if (isValid(date)) {
          return format(date, 'MMMM d, yyyy');
        }
      }
      return dateString; // Fallback
    } catch (error) {
      console.error('Error formatting date for display:', error, dateString);
      return dateString; // Fallback
    }
  }, []);


  const modalTitle = useMemo(() => (isEditing ? 'Edit Event' : 'Add New Event'), [isEditing]);

  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  [events]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">Manage Carousel Events</h1>
          <button
            onClick={() => setShowHelp(prev => !prev)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle help guide"
            aria-expanded={showHelp}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          {showHelp && (
            <div className="absolute top-20 left-4 z-30 w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200" role="tooltip">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900">Quick Help Guide</h3>
                <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-500" aria-label="Close help">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-600 space-y-2">
                <p><strong>Adding/Editing:</strong> Use the modal to manage event details.</p>
                <p><strong>Images:</strong> Recommended 21:8 aspect ratio. Max 5MB (JPG, PNG, GIF, WebP).</p>
                <p><strong>Image Fit/Position:</strong> Control how images appear in the carousel.</p>
                <p><strong>Excerpt:</strong> Auto-generated if empty (max 140 chars).</p>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center gap-2 rounded-md bg-[#063f48] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
        >
          <Plus className="h-5 w-5" />
          Add New Event
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#063f48]" /></div>
      ) : error && !events.length ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0"><Info className="h-5 w-5 text-red-400" /></div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
            </div>
          </div>
        </div>
      ) : !sortedEvents.length ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
          <div className="mt-6">
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center rounded-md bg-[#063f48] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Event
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48">
                <Image
                  src={event.imageSrc}
                  alt={event.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{
                    objectFit: event.objectFit || 'cover',
                    objectPosition: event.imagePosition || 'center'
                  }}
                  quality={75}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-[#063f48] transition-colors">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDateForDisplay(event.date)}
                </p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {event.excerpt || event.description}
                </p>
                {event.link && event.link !== '#' && (
                  <p className="mt-2 text-sm text-[#063f48] flex items-center">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {event.link}
                    </a>
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Pos: {event.imagePosition || 'center'} | Fit: {event.objectFit || 'cover'}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2"
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto admin-modal">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)} // Use resetFormAndModal if preferred
              aria-hidden="true"
            ></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <form id="event-form" onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                        {modalTitle}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
                          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="admin-input mt-1" placeholder="Event title" />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
                          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="admin-input mt-1" />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                          <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} required className="admin-input mt-1" placeholder="Full event description" />
                        </div>
                        <div>
                          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt (Optional)</label>
                          <textarea name="excerpt" id="excerpt" rows={2} value={formData.excerpt} onChange={handleChange} className="admin-input mt-1" placeholder="Short teaser (auto-generated if empty)" />
                          <p className="mt-1 text-xs text-gray-500">Max 140 chars. Auto-generated from description if empty.</p>
                        </div>
                        <div>
                          <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link (URL)</label>
                          <input type="url" name="link" id="link" value={formData.link} onChange={handleChange} placeholder="https://example.com/event" className="admin-input mt-1" />
                        </div>
                        <ImageUploadField
                          imagePreview={imagePreview}
                          isEditing={isEditing}
                          onChange={handleImageChange}
                          onRemove={imagePreview ? handleRemoveImage : undefined}
                        />
                        <div>
                          <label htmlFor="imageAlt" className="block text-sm font-medium text-gray-700">Image Alt Text</label>
                          <input type="text" name="imageAlt" id="imageAlt" value={formData.imageAlt} onChange={handleChange} placeholder="Brief image description (auto-generated if empty)" className="admin-input mt-1" />
                           <p className="mt-1 text-xs text-gray-500">For accessibility. Uses event title if empty.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="imagePosition" className="block text-sm font-medium text-gray-700">Image Position</label>
                            <select name="imagePosition" id="imagePosition" value={formData.imagePosition} onChange={handleChange} className="admin-input mt-1">
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">Focus point if image is cropped.</p>
                          </div>
                          <div>
                            <label htmlFor="objectFit" className="block text-sm font-medium text-gray-700">Object Fit</label>
                            <select name="objectFit" id="objectFit" value={formData.objectFit} onChange={handleChange} className="admin-input mt-1">
                              <option value="cover">Cover (fill, may crop)</option>
                              <option value="contain">Contain (show all)</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">How image fits container.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#063f48] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#0a5561] focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={resetFormAndModal}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#063f48] focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
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