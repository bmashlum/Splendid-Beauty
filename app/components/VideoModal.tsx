import { Dialog } from '@headlessui/react'

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoId: string
}

export default function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
        >
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative bg-black rounded-lg">
                    <button
                        onClick={onClose}
                        className="absolute -top-10 right-0 text-white hover:text-gray-300"
                    >
                        Close
                    </button>
                    <div className="w-[80vw] h-[80vh] max-w-5xl">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        />
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
} 
