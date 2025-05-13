// components/google-maps.tsx
'use client'

export default function GoogleMaps() {
    // Consider making the embed URL an environment variable or prop if it might change
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.8390!2d-83.9001!3d33.8390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5a3c1c1c1c1c1%3A0x1c1c1c1c1c1c1c1c!2s104%20Covington%20St%2C%20Loganville%2C%20GA%2030052!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus";

    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <iframe
                src={mapEmbedUrl} // Use variable
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy" // Lazy loading is good for maps
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map location of Splendid Beauty Bar" // Accessibility title
            />
        </div>
    )
}