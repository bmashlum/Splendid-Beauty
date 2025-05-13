'use client';

import { useEffect } from 'react';

// This component will create placeholder SVG images for blog posts
export default function PlaceholderImages() {
  useEffect(() => {
    // Create placeholder SVG images for blog posts
    const createPlaceholderImages = () => {
      const placeholders = [
        {
          name: 'skincare-routine.jpg',
          backgroundColor: '#DAB17B',
          textColor: '#333',
          text: 'Skincare Routine',
          icon: '✨'
        },
        {
          name: 'hair-care.jpg',
          backgroundColor: '#8E7367',
          textColor: '#fff',
          text: 'Hair Care',
          icon: '💆‍♀️'
        },
        {
          name: 'makeup-trends.jpg',
          backgroundColor: '#C09E6C',
          textColor: '#fff',
          text: 'Makeup Trends',
          icon: '💄'
        },
        {
          name: 'brow-styling.jpg',
          backgroundColor: '#063f48',
          textColor: '#fff',
          text: 'Brow Styling',
          icon: '👁️'
        },
        {
          name: 'facial-treatments.jpg',
          backgroundColor: '#052b31',
          textColor: '#fff',
          text: 'Facial Treatments',
          icon: '🧖‍♀️'
        },
        {
          name: 'natural-beauty.jpg',
          backgroundColor: '#A0C1B9',
          textColor: '#333',
          text: 'Natural Beauty',
          icon: '🌿'
        },
        {
          name: 'nail-art.jpg',
          backgroundColor: '#DE8C91',
          textColor: '#fff',
          text: 'Nail Art',
          icon: '💅'
        },
        {
          name: 'chemical-peels.jpg',
          backgroundColor: '#7A9CAE',
          textColor: '#fff',
          text: 'Chemical Peels',
          icon: '✨'
        },
        {
          name: 'sustainable-beauty.jpg',
          backgroundColor: '#8DB38B',
          textColor: '#333',
          text: 'Sustainable Beauty',
          icon: '♻️'
        }
      ];

      // Function to create and save SVG
      const createSVG = (placeholder: any) => {
        // Create SVG element
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '800');
        svg.setAttribute('height', '600');
        svg.setAttribute('viewBox', '0 0 800 600');
        
        // Background
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', placeholder.backgroundColor);
        svg.appendChild(rect);
        
        // Pattern overlay
        const pattern = document.createElementNS(svgNS, 'pattern');
        pattern.setAttribute('id', 'pattern');
        pattern.setAttribute('width', '40');
        pattern.setAttribute('height', '40');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('patternTransform', 'rotate(45)');
        
        const patternRect = document.createElementNS(svgNS, 'rect');
        patternRect.setAttribute('width', '100%');
        patternRect.setAttribute('height', '100%');
        patternRect.setAttribute('fill', placeholder.backgroundColor);
        pattern.appendChild(patternRect);
        
        const patternLine = document.createElementNS(svgNS, 'line');
        patternLine.setAttribute('x1', '0');
        patternLine.setAttribute('y1', '0');
        patternLine.setAttribute('x2', '0');
        patternLine.setAttribute('y2', '40');
        patternLine.setAttribute('stroke', placeholder.textColor);
        patternLine.setAttribute('stroke-width', '1');
        patternLine.setAttribute('stroke-opacity', '0.1');
        pattern.appendChild(patternLine);
        
        svg.appendChild(pattern);
        
        const patternOverlay = document.createElementNS(svgNS, 'rect');
        patternOverlay.setAttribute('width', '100%');
        patternOverlay.setAttribute('height', '100%');
        patternOverlay.setAttribute('fill', 'url(#pattern)');
        patternOverlay.setAttribute('opacity', '0.2');
        svg.appendChild(patternOverlay);
        
        // Icon
        const iconText = document.createElementNS(svgNS, 'text');
        iconText.setAttribute('x', '400');
        iconText.setAttribute('y', '250');
        iconText.setAttribute('font-size', '100');
        iconText.setAttribute('text-anchor', 'middle');
        iconText.setAttribute('dominant-baseline', 'middle');
        iconText.textContent = placeholder.icon;
        svg.appendChild(iconText);
        
        // Title
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('x', '400');
        text.setAttribute('y', '340');
        text.setAttribute('font-size', '40');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('fill', placeholder.textColor);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = placeholder.text;
        svg.appendChild(text);
        
        // "Splendid Beauty" text
        const brandText = document.createElementNS(svgNS, 'text');
        brandText.setAttribute('x', '400');
        brandText.setAttribute('y', '400');
        brandText.setAttribute('font-size', '20');
        brandText.setAttribute('font-family', 'Arial, sans-serif');
        brandText.setAttribute('fill', placeholder.textColor);
        brandText.setAttribute('fill-opacity', '0.7');
        brandText.setAttribute('text-anchor', 'middle');
        brandText.textContent = 'Splendid Beauty Blog';
        svg.appendChild(brandText);
        
        // Convert SVG to string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        
        // Create a blob from the SVG string
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = placeholder.name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      };
      
      // Generate all placeholders
      placeholders.forEach(placeholder => {
        createSVG(placeholder);
      });
    };
    
    // Uncomment this line to generate placeholder images when needed
    // createPlaceholderImages();
  }, []);
  
  return null;
}
