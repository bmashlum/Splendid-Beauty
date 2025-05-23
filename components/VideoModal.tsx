// app/components/VideoModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, memo, useEffect, useCallback } from 'react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
}

const VideoModal = memo(function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    
    // Handle backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                </Transition.Child>

                {/* Modal Content */}
                <div className="fixed inset-0 flex items-center justify-center p-4" onClick={handleBackdropClick}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-black text-left align-middle shadow-xl transition-all">
                            {/* Optional: Add a Title for Accessibility */}
                            <Dialog.Title as="h3" className="sr-only">
                                Video Player
                            </Dialog.Title>
                            <button
                                onClick={onClose}
                                className="absolute -top-8 right-0 z-10 text-white hover:text-gray-300 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                aria-label="Close video player" // Accessibility label
                            >
                                {/* Simple text or an X icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {/* Aspect ratio container for video */}
                            <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="rounded-lg"
                                    title={`Splendid Beauty Bar video presentation`}
                                    loading="lazy"
                                />
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
});

VideoModal.displayName = 'VideoModal';

export default VideoModal;