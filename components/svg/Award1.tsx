import Image from 'next/image'

export default function Award1() {
    return (
        <Image
            src="/images/about_companion_image_award.webp"
            alt="Award illustration"
            width={800}
            height={600}
            className="h-full w-full object-cover"
        />
    )
} 