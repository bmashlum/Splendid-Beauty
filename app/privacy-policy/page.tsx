import Image from 'next/image';
import privacyImage from '@/public/images/28.webp';

export default function PrivacyPolicy() {
  return (
    <div 
      className="min-h-screen bg-[url('/images/elegant-gold-background.webp')] bg-cover bg-center" 
      style={{ 
        backgroundImage: "url('/images/elegant-gold-background.webp')",
        backgroundColor: "#f9f7e8",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Privacy Policy</h1>
        
        <div className="relative w-full h-[1000px] mb-8">
          <Image
            src={privacyImage}
            alt="Privacy Policy for Splendid Beauty Bar & Co."
            fill
            className="object-contain"
            priority
          />
        </div>
        
        <div className="text-center text-gray-600 max-w-4xl mx-auto">
          <p className="mb-4">
            This privacy policy outlines how Splendid Beauty Bar & Co. collects, uses, and protects your personal information.
          </p>
          <p className="text-sm">
            For questions about our privacy practices, please contact us at your convenience.
          </p>
        </div>
      </div>
    </div>
  );
}