'use client';

import React, { useState } from 'react';
import DraggableHoverPoints from '@/components/DraggableHoverPoints';

const services = [
  { id: 'perm-makeup', name: 'Permanent Makeup', image: '/images/perm_makeup.webp' },
  { id: 'perm-medical', name: 'Medical Permanent', image: '/images/perm_medical.webp' },
  { id: 'facial', name: 'Facial', image: '/images/facial.webp' },
  { id: 'eyelash', name: 'Eyelash', image: '/images/eyelash.webp' }
];

export default function HoverTestPage() {
  const [selectedService, setSelectedService] = useState('perm-makeup');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Hover Point Position Editor</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service to Edit:
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#063f48] focus:border-[#063f48]"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <DraggableHoverPoints 
          serviceId={selectedService} 
          imageUrl={services.find(s => s.id === selectedService)?.image}
        />
      </div>
    </div>
  );
}