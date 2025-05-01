export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Latest Beauty Trends For Summer',
    slug: 'latest-beauty-trends-summer',
    excerpt: 'Discover the hottest beauty trends that are making waves this summer season...',
    content: `
      <h2>The Hottest Beauty Trends This Summer</h2>
      
      <p>As temperatures rise, beauty enthusiasts everywhere are embracing new trends that celebrate natural glow, minimal effort, and maximum impact. This summer, it's all about enhancing your natural beauty while keeping your routine simple and sustainable.</p>
      
      <h3>1. Skinimalism</h3>
      
      <p>Less is more this season. The "skinimalism" trend focuses on using fewer products but making each one count. Think tinted moisturizers with SPF, multi-use sticks for lips and cheeks, and lightweight serums that do the heavy lifting.</p>
      
      <h3>2. Glossy Lips Are Back</h3>
      
      <p>Matte lips are taking a backseat to glossy, hydrated pouts. Modern lip glosses are less sticky than their predecessors and often come infused with nourishing ingredients like hyaluronic acid and vitamin E.</p>
      
      <h3>3. Sunscreen as Skincare</h3>
      
      <p>With increased awareness about sun damage, sunscreen has evolved from a beach necessity to an everyday skincare staple. Brands are now formulating sophisticated SPF products that not only protect but also improve skin texture and appearance.</p>
      
      <p>Visit our salon to learn more about how to incorporate these trends into your beauty routine!</p>
    `,
    coverImage: '/images/blog-placeholder.jpg',
    date: '2025-04-15',
    author: 'Sarah Johnson',
    tags: ['Summer', 'Beauty Trends', 'Skincare', 'Makeup']
  },
  {
    id: '2',
    title: 'Essential Skincare Routine Steps',
    slug: 'essential-skincare-routine-steps',
    excerpt: 'The fundamental skincare routine steps everyone should follow for healthy, glowing skin...',
    content: `
      <h2>Building Your Perfect Skincare Routine</h2>
      
      <p>A consistent skincare routine is the foundation of healthy, radiant skin. While everyone's skin has different needs, these essential steps form the backbone of any effective regimen.</p>
      
      <h3>Morning Routine</h3>
      
      <ol>
        <li><strong>Cleanse</strong>: Start with a gentle cleanser to remove overnight oil buildup without stripping your skin.</li>
        <li><strong>Tone</strong>: Balance your skin's pH with an alcohol-free toner.</li>
        <li><strong>Serum</strong>: Apply a vitamin C or antioxidant serum to protect against environmental damage.</li>
        <li><strong>Moisturize</strong>: Lock in hydration with a moisturizer suitable for your skin type.</li>
        <li><strong>Sunscreen</strong>: Finish with broad-spectrum SPF 30 or higher, even on cloudy days.</li>
      </ol>
      
      <h3>Evening Routine</h3>
      
      <ol>
        <li><strong>Double Cleanse</strong>: Remove makeup and sunscreen with an oil-based cleanser, followed by a water-based cleanser.</li>
        <li><strong>Exfoliate</strong>: Use chemical exfoliants (AHAs/BHAs) 2-3 times per week.</li>
        <li><strong>Treatment</strong>: Apply targeted treatments like retinol or peptides.</li>
        <li><strong>Moisturize</strong>: Use a richer night cream to support skin repair while you sleep.</li>
      </ol>
      
      <p>Remember, consistency is key! Book a consultation with our skincare specialists to create a personalized routine for your unique needs.</p>
    `,
    coverImage: '/images/blog-placeholder.jpg',
    date: '2025-04-01',
    author: 'Emma Williams',
    tags: ['Skincare', 'Beauty Routine', 'Skin Health']
  },
  {
    id: '3',
    title: 'Professional Hair Care Secrets',
    slug: 'professional-hair-care-secrets',
    excerpt: 'Expert stylists share their best-kept secrets for maintaining beautiful, healthy hair...',
    content: `
      <h2>Secrets to Salon-Quality Hair Every Day</h2>
      
      <p>Ever wondered how to maintain that fresh-from-the-salon look between appointments? Our expert stylists are sharing their professional secrets for keeping your locks looking their best.</p>
      
      <h3>The Foundation: Proper Washing Technique</h3>
      
      <p>Most people don't realize that how you wash your hair makes a huge difference. Focus shampoo on the scalp, not the ends, and use lukewarm (never hot) water. Always follow with conditioner on the mid-lengths to ends, leaving it on for 2-3 minutes before rinsing thoroughly.</p>
      
      <h3>Heat Styling Protection</h3>
      
      <p>Never skip heat protectant when using hot tools! Apply to damp hair before blow-drying and again on dry hair before using curling irons or straighteners. Keep tools at or below 350°F (180°C) to minimize damage.</p>
      
      <h3>Weekly Treatment Rituals</h3>
      
      <p>Incorporate a weekly hair mask or oil treatment to replenish moisture and nutrients. For fine hair, focus on lightweight protein treatments; for coarse or curly hair, deep conditioning masks work wonders.</p>
      
      <h3>The Right Brush Matters</h3>
      
      <p>Use different brushes for different purposes: wide-tooth combs for wet hair, natural bristle brushes for smoothing, and vented brushes for blow-drying. Never brush aggressively, especially when wet.</p>
      
      <p>Book an appointment with our stylists to receive personalized hair care advice tailored to your specific hair type and concerns!</p>
    `,
    coverImage: '/images/blog-placeholder.jpg',
    date: '2025-03-20',
    author: 'Michael Chen',
    tags: ['Hair Care', 'Styling Tips', 'Professional Advice']
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
