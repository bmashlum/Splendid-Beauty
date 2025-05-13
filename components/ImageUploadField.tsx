'use client'

import React, { useState } from 'react';
import { Image as ImageIcon, FileWarning, Info } from 'lucide-react';

interface ImageUploadFieldProps {
  imagePreview: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: () => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imagePreview,
  isEditing,
  onChange,
  onRemove
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file
      if (!validateFile(file)) {
        return;
      }
      
      // Create a synthetic event to pass to the onChange handler
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files,
          name: 'image'
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  // Validate file type and size
  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    // Check file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setFileError('Please upload an image file (JPG, PNG, GIF, or WebP)');
      return false;
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('Image is too large. Maximum size is 5MB');
      return false;
    }
    
    return true;
  };

  // Custom file input change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file && validateFile(file)) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 flex items-center"
        >
          Image {!isEditing && '*'}
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="ml-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Image guidelines"
          >
            <Info className="h-4 w-4" />
          </button>
        </label>
      </div>
      
      {/* Image guidelines tooltip */}
      {showInfo && (
        <div className="p-3 bg-blue-50 rounded-md text-xs text-blue-800 mb-2">
          <p className="font-medium mb-1">Image Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Optimal aspect ratio is 21:8 (width to height)</li>
            <li>Images will be automatically resized and optimized</li>
            <li>Max file size: 5MB</li>
            <li>Accepted formats: JPG, PNG, GIF, WebP</li>
            <li>Keep important content centered as edges may be cropped</li>
          </ul>
        </div>
      )}
      
      {/* Drag and drop area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-4 ${
          dragActive 
            ? 'border-[#063f48] bg-[#063f48]/5' 
            : 'border-gray-300 hover:border-gray-400'
        } transition-colors`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex items-start space-x-4">
          {/* Image preview */}
          <div className="h-32 w-48 overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex flex-col items-start">
              <label className="relative cursor-pointer rounded-md bg-white font-medium text-[#063f48] focus-within:outline-none hover:text-[#0a5561]">
                <span className="inline-flex items-center px-4 py-2 border border-[#063f48] text-sm rounded-md hover:bg-gray-50">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {imagePreview ? 'Change image' : 'Select image'}
                </span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              
              {imagePreview && onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              {isEditing
                ? 'Leave empty to keep the current image'
                : 'Drag and drop or click to select an image'}
            </p>
            
            {/* File error message */}
            {fileError && (
              <div className="flex items-center text-xs text-red-600 mt-1">
                <FileWarning className="h-3 w-3 mr-1" />
                {fileError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;