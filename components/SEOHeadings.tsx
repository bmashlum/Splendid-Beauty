// SEO-focused heading structure - visually hidden but accessible to search engines
import React from 'react';

interface SEOHeadingsProps {
  className?: string;
}

const SEOHeadings: React.FC<SEOHeadingsProps> = ({ className = "" }) => {
  return (
    <div className={`sr-only ${className}`} aria-hidden="true">
      {/* Primary H1 for homepage */}
      <h1>
        Splendid Beauty Bar & Co. - Premier Beauty Studio in Atlanta, Georgia
      </h1>
      
      {/* Service category headings */}
      <h2>Professional Beauty Services in Atlanta</h2>
      <h3>Luxury Facial Treatments</h3>
      <h3>Expert Permanent Makeup & Microblading</h3>
      <h3>Premium Eyelash Extensions</h3>
      <h3>Clinical Chemical Peels</h3>
      <h3>Professional Brow Artistry</h3>
      
      <h2>About Our Atlanta Beauty Studio</h2>
      <h3>Expert Beauty Technicians</h3>
      <h3>State-of-the-Art Equipment</h3>
      <h3>Luxury Treatment Rooms</h3>
      
      <h2>Beauty Education & Training</h2>
      <h3>Professional Beauty Courses</h3>
      <h3>Certification Programs</h3>
      <h3>Advanced Techniques Training</h3>
      
      <h2>Contact & Location</h2>
      <h3>Schedule Your Atlanta Beauty Appointment</h3>
      <h3>Located in the Heart of Atlanta</h3>
      <h3>Convenient Parking Available</h3>
    </div>
  );
};

export default SEOHeadings;