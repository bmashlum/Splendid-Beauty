'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LinktreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

const LinktreeModal: React.FC<LinktreeModalProps> = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="linktreeModalTitle"
            >
                <motion.div
                    className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[85vh]"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                >
                    <div className="flex items-center justify-between border-b bg-gray-100 p-3 sm:p-4">
                        <h2 id="linktreeModalTitle" className="text-md sm:text-lg font-medium text-gray-800">Shop Links</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                            aria-label="Close shop links"
                        >
                            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <iframe
                        src={url}
                        className="h-full w-full flex-grow border-none"
                        title="Shop links"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LinktreeModal; 