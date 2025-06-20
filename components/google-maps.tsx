// components/google-maps.tsx
'use client'

export default function GoogleMaps() {
    // Consider making the embed URL an environment variable or prop if it might change
    // Use a proper Google Maps embed URL for the actual location
    // To get this URL: Go to Google Maps, search for your location, click Share > Embed a map
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.7690764470657!2d-83.90228492408!3d33.87891917322315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5b8f3a7b9c3d7%3A0x5e8f4a8b7e3f4a8b!2s104%20Covington%20St%2C%20Loganville%2C%20GA%2030052!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

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