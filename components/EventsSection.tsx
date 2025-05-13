'use client'

import React, { useState, useEffect } from 'react';
import EventCarousel from './EventCarousel';
import EventDetailsModal from './modals/EventDetailsModal';
import { EventCardProps } from './EventCard';
import { Loader2 } from 'lucide-react';

const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch events from our API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // If there are no events, don't render the section
  if (!loading && events.length === 0) {
    return null;
  }

  const handleEventClick = (event: EventCardProps) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section id="events" className="w-[95%] mx-auto my-4 sm:my-6 rounded-lg overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center bg-gray-100 p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#063f48]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 text-center text-red-800">
          {error}
        </div>
      ) : (
        <>
          <EventCarousel 
            events={events} 
            onEventClick={handleEventClick} 
          />
          <EventDetailsModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </>
      )}
    </section>
  )
};

export default EventsSection;