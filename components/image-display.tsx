import Image from "next/image"

interface ImageDisplayProps {
  images: string[]
  layout: "full" | "grid"
  priority?: boolean
  alt: string
}

export default function ImageDisplay({ images, layout, priority = false, alt }: ImageDisplayProps) {
  if (layout === "full" && images.length === 1) {
    return (
      <div className="relative w-full h-screen">
        <Image
          src={images[0] || "/placeholder.svg"}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          quality={90}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <div key={index} className="relative w-full aspect-[3/2] overflow-hidden rounded-lg shadow-md">
            <Image
              src={src || "/placeholder.svg"}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              priority={priority && index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
