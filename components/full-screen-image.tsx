import Image from "next/image"
import { cn } from "@/lib/utils"

interface FullScreenImageProps {
  src: string
  alt: string
  id?: string
  isFirst?: boolean
  isLast?: boolean
  priority?: boolean
  sectionId: string
  index: number
}

export default function FullScreenImage({
  src,
  alt,
  id,
  isFirst = false,
  isLast = false,
  priority = false,
  sectionId,
  index,
}: FullScreenImageProps) {
  // Determine if this is the first image of a section
  const isFirstOfSection =
    index === 0 ||
    (sectionId === "facials" && index === 1) ||
    (sectionId === "brows" && index === 7) ||
    (sectionId === "peels" && index === 13) ||
    (sectionId === "contact" && index === 19)

  return (
    <section
      id={isFirstOfSection ? sectionId : undefined}
      className={cn(
        "relative w-full h-screen snap-start",
        sectionId === "facials" || sectionId === "peels" ? "bg-stone-50" : "bg-white",
      )}
    >
      <div className="relative w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
      </div>
    </section>
  )
}
