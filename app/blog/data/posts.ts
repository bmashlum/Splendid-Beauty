// app/blog/data/posts.ts
export interface BlogPost {
  id: string
  slug: string
  title: string
  date: string
  author: string
  coverImage: string
  excerpt: string
  content: string
  tags: string[]
  category: string
  readTime: string
}

export const POSTS_PER_PAGE = 9

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'essential-skincare-routine',
    title: 'Essential Skincare Routine for Radiant Skin',
    date: '2024-03-15',
    author: 'Dr. Sarah Johnson',
    coverImage: 'https://picsum.photos/seed/skincare1/800/600',
    excerpt: 'Learn the fundamental steps to achieve and maintain healthy, glowing skin with our expert-recommended skincare routine.',
    content: `
      <h2>Understanding Your Skin Type</h2>
      <p>Before diving into any skincare routine, it's crucial to understand your skin type. Whether you have oily, dry, combination, or sensitive skin, knowing your skin's needs helps you choose the right products.</p>
      
      <h2>Morning Routine</h2>
      <p>A proper morning skincare routine prepares your skin for the day ahead and provides essential protection against environmental stressors.</p>
      
      <h3>1. Cleanse</h3>
      <p>Start with a gentle cleanser to remove any oils or residue that accumulated overnight. For dry skin, opt for cream or oil-based cleansers. For oily skin, gel or foam cleansers work best.</p>
      
      <h3>2. Tone</h3>
      <p>Apply a toner to balance your skin's pH and prepare it for the next steps. Avoid alcohol-based toners as they can strip the skin of natural oils.</p>
      
      <h3>3. Serum</h3>
      <p>Apply a vitamin C serum for antioxidant protection against free radicals and environmental damage. This also helps brighten the skin over time.</p>
      
      <h3>4. Moisturize</h3>
      <p>Choose a moisturizer appropriate for your skin type. Those with oily skin should opt for lightweight, oil-free formulas, while those with dry skin benefit from richer creams.</p>
      
      <h3>5. Sunscreen</h3>
      <p>Apply a broad-spectrum SPF 30 or higher as the final step. This is the most crucial anti-aging product in your routine and should never be skipped, regardless of weather or season.</p>
      
      <h2>Evening Routine</h2>
      <p>Your nighttime routine focuses on repair and rejuvenation while you sleep.</p>
      
      <h3>1. Double Cleanse</h3>
      <p>First, use an oil-based cleanser to remove makeup and sunscreen. Follow with a water-based cleanser to clean the skin thoroughly.</p>
      
      <h3>2. Exfoliate (2-3 times weekly)</h3>
      <p>Use either a chemical exfoliant (AHAs or BHAs) or a gentle physical exfoliant to remove dead skin cells and promote cell turnover.</p>
      
      <h3>3. Treatment</h3>
      <p>Apply any specialized treatments, such as retinol for anti-aging, niacinamide for oil control, or hyaluronic acid for hydration.</p>
      
      <h3>4. Eye Cream</h3>
      <p>Gently pat eye cream around the orbital bone to address specific concerns like dark circles, puffiness, or fine lines.</p>
      
      <h3>5. Moisturize</h3>
      <p>Finish with a slightly richer nighttime moisturizer to lock in all the active ingredients and repair your skin's barrier overnight.</p>
      
      <h2>Weekly Treatments</h2>
      <p>In addition to your daily routine, incorporate weekly treatments for extra care.</p>
      
      <h3>Face Masks</h3>
      <p>Use a mask appropriate for your skin's needs once or twice a week. Clay masks work well for oily skin, while hydrating masks benefit dry skin.</p>
      
      <h3>Professional Treatments</h3>
      <p>Consider monthly facials or specialized treatments like chemical peels or microdermabrasion for enhanced results.</p>
      
      <h2>Lifestyle Factors for Healthy Skin</h2>
      <p>Remember that skincare isn't just about products. Stay hydrated, eat a balanced diet rich in antioxidants, get adequate sleep, and manage stress levels for truly radiant skin.</p>
    `,
    tags: ['Skincare', 'Beauty Tips', 'Routine'],
    category: 'Skincare',
    readTime: '6 min read'
  },
  {
    id: '2',
    slug: 'hair-care-tips',
    title: 'Professional Hair Care Tips for Luscious Locks',
    date: '2024-03-10',
    author: 'Emma Thompson',
    coverImage: 'https://picsum.photos/seed/haircare1/800/600',
    excerpt: 'Discover professional techniques and products that will transform your hair care routine and give you the hair of your dreams.',
    content: `
      <h2>Understanding Your Hair Type</h2>
      <p>Just like skin, hair comes in different types and textures. Knowing whether your hair is straight, wavy, curly, or coily, as well as its porosity and density, helps determine the best care routine.</p>
      
      <h2>Essential Hair Care Practices</h2>
      
      <h3>Washing Technique</h3>
      <p>Most people don't need to wash their hair daily. For most hair types, 2-3 times per week is sufficient. Focus the shampoo on your scalp rather than the lengths, and always follow with conditioner, concentrating on the mid-lengths to ends.</p>
      
      <h3>Temperature Matters</h3>
      <p>While hot showers feel amazing, they're not great for your hair. Rinse with lukewarm water, and finish with a cool rinse to seal the cuticle and add shine.</p>
      
      <h3>Gentle Drying</h3>
      <p>Avoid rough towel-drying, which can cause breakage and frizz. Instead, gently squeeze out excess water and pat dry with a microfiber towel or old cotton t-shirt.</p>
      
      <h2>Product Recommendations by Hair Type</h2>
      
      <h3>Fine Hair</h3>
      <p>Look for volumizing, lightweight products that won't weigh hair down. Avoid heavy oils and opt for mousses and lightweight serums instead.</p>
      
      <h3>Thick Hair</h3>
      <p>Rich, moisturizing products work well for thick hair. Deep conditioning masks and hair oils can help manage thickness and add moisture.</p>
      
      <h3>Curly Hair</h3>
      <p>Embrace sulfate-free shampoos, generous conditioners, and leave-in products. Consider the "curly girl method" which eliminates sulfates, silicones, and heat styling.</p>
      
      <h3>Color-Treated Hair</h3>
      <p>Invest in color-safe products specifically designed to extend the life of your color. UV protection is also important to prevent fading.</p>
      
      <h2>Heat Styling Tips</h2>
      <p>Always use heat protectant before blow-drying, straightening, or curling. Try to limit heat styling to 2-3 times per week, and keep tools at the lowest effective temperature for your hair type.</p>
      
      <h2>Professional Treatments Worth Trying</h2>
      
      <h3>Deep Conditioning Treatments</h3>
      <p>Add a weekly deep conditioning mask to restore moisture and improve elasticity.</p>
      
      <h3>Bond-Building Treatments</h3>
      <p>Products like Olaplex can help repair damage and strengthen hair bonds, especially for color-treated or heat-damaged hair.</p>
      
      <h3>Scalp Treatments</h3>
      <p>Don't forget your scalp! Exfoliating treatments remove buildup and promote healthy hair growth.</p>
      
      <h2>Trimming Schedule</h2>
      <p>Regular trims every 8-12 weeks help prevent split ends from traveling up the hair shaft. Even if you're growing your hair, maintaining regular trims is essential for healthy-looking locks.</p>
      
      <h2>Nutrition for Healthy Hair</h2>
      <p>Beautiful hair starts from within. Ensure your diet includes protein, omega-3 fatty acids, biotin, vitamins A and E, and minerals like zinc and iron. Consider supplements if your diet is lacking in these nutrients.</p>
    `,
    tags: ['Hair Care', 'Beauty Tips'],
    category: 'Hair Care',
    readTime: '5 min read'
  },
  {
    id: '3',
    slug: 'makeup-trends-2024',
    title: 'Top Makeup Trends to Watch in 2024',
    date: '2024-03-05',
    author: 'Lisa Chen',
    coverImage: 'https://picsum.photos/seed/makeup1/800/600',
    excerpt: 'Stay ahead of the curve with our expert analysis of the hottest makeup trends that will dominate the beauty scene this year.',
    content: `
      <h2>Skinimalism Continues to Reign</h2>
      <p>The "less is more" approach continues to dominate in 2024, with a focus on enhancing natural beauty rather than masking it. Think lightweight foundations, strategic concealer placement, and subtle enhancement.</p>
      
      <h3>How to Achieve It</h3>
      <p>Start with a hydrating primer, followed by a tinted moisturizer or skin tint rather than heavy foundation. Spot-conceal only where needed, and use cream products for a natural flush and glow.</p>
      
      <h2>Bold, Graphic Eyeliner</h2>
      <p>While natural skin is in, bold eye statements are making a comeback. Graphic liner in unexpected shapes and colors offers a perfect contrast to minimalist base makeup.</p>
      
      <h3>How to Achieve It</h3>
      <p>Use a fine-tip liquid liner for precision. If you're new to graphic liner, start with simple wing extensions or dots at the outer corners. Experiment with colors beyond black, like cobalt blue, emerald green, or vibrant purple.</p>
      
      <h2>Glossy Everything</h2>
      <p>High-shine finishes are everywhere this year—lips, eyelids, and even cheekbones. The modern gloss isn't sticky or uncomfortable; today's formulas offer shine without the drawbacks.</p>
      
      <h3>How to Achieve It</h3>
      <p>For glossy eyes, try a clear eye gloss over eyeshadow or on bare lids. For cheeks, use a glossy highlighter on the high points. And of course, keep a comfortable lip gloss handy for that perfect shine.</p>
      
      <h2>Blush Draping</h2>
      <p>Blush is moving beyond the apples of the cheeks. "Blush draping" involves applying blush higher on the cheekbones and even into the temple area for a sculpted, lifted effect.</p>
      
      <h3>How to Achieve It</h3>
      <p>Use a fluffy brush to apply blush at the highest point of your cheekbone, then blend upward toward your temple in a C-shape. Cream formulas work particularly well for this technique.</p>
      
      <h2>Statement Lips in Unexpected Colors</h2>
      <p>While classic reds never go out of style, 2024 brings more adventurous lip colors into the mainstream, including terracotta, burgundy, and even purple and blue-toned shades.</p>
      
      <h3>How to Achieve It</h3>
      <p>For bold lip colors, precision is key. Use a lip liner in a similar shade to outline and define, then fill in with your chosen color. Blot and reapply for longevity.</p>
      
      <h2>Elevated "No-Makeup" Makeup</h2>
      <p>Professional-looking "no-makeup" makeup requires more technique than you might expect. The goal is to look naturally flawless while appearing as though you're wearing nothing at all.</p>
      
      <h3>How to Achieve It</h3>
      <p>Focus on skin prep with hydrating skincare. Use a tinted primer or skin tint with a natural finish. Apply concealer only where needed and set with minimal powder. Use cream products for cheeks and eyes, and finish with a brow gel and subtle mascara.</p>
      
      <h2>Sustainable Beauty Practices</h2>
      <p>Beyond specific looks, 2024 shows a strong trend toward sustainable beauty. Consumers are increasingly looking for refillable packaging, plastic-free alternatives, and ethically sourced ingredients.</p>
      
      <h3>How to Achieve It</h3>
      <p>Research brands with strong sustainability credentials. Consider products with refillable packaging, and look for multi-use options (like lip and cheek tints) to minimize your product footprint.</p>
    `,
    tags: ['Makeup', 'Trends', 'Beauty Tips'],
    category: 'Makeup',
    readTime: '5 min read'
  },
  {
    id: '4',
    slug: 'natural-hair-care',
    title: 'Natural Hair Care: Embracing Your Natural Texture',
    date: '2024-02-28',
    author: 'Maria Rodriguez',
    coverImage: 'https://picsum.photos/seed/naturalhair1/800/600',
    excerpt: 'Learn how to care for and style your natural hair with our expert tips and product recommendations.',
    content: `
      <h2>Understanding Natural Hair Types</h2>
      <p>Natural hair comes in a variety of textures, from loose waves to tight coils. Understanding your specific hair type helps you choose the right products and techniques.</p>
      
      <h2>Essential Natural Hair Care Practices</h2>
      
      <h3>Moisture is Key</h3>
      <p>Natural hair tends to be dry, so maintaining moisture is crucial. Use a sulfate-free shampoo, follow with a rich conditioner, and incorporate deep conditioning treatments weekly.</p>
      
      <h3>Detangling Techniques</h3>
      <p>Detangle your hair when it's wet and saturated with conditioner. Use your fingers or a wide-tooth comb, starting from the ends and working your way up to the roots.</p>
      
      <h3>Protective Styling</h3>
      <p>Protective styles like braids, twists, and buns help minimize breakage and retain length. Ensure your hair is well-moisturized before styling and avoid styles that pull too tightly.</p>
      
      <h2>Product Recommendations</h2>
      
      <h3>Cleansers</h3>
      <p>Look for sulfate-free shampoos or co-washes that gently cleanse without stripping moisture.</p>
      
      <h3>Conditioners</h3>
      <p>Use a rich, moisturizing conditioner and consider leave-in conditioners for added hydration.</p>
      
      <h3>Styling Products</h3>
      <p>Experiment with creams, butters, and oils to find what works best for your hair. Popular options include shea butter, coconut oil, and argan oil.</p>
      
      <h2>Styling Techniques</h2>
      
      <h3>Wash and Go</h3>
      <p>For a simple, low-manipulation style, apply products to wet hair and allow it to air dry. Use a diffuser for faster drying if desired.</p>
      
      <h3>Twist Outs and Braid Outs</h3>
      <p>These techniques create defined curls and waves. Apply product to damp hair, twist or braid, and allow to dry completely before unraveling.</p>
      
      <h3>Bantu Knots</h3>
      <p>Create small knots throughout your hair for a unique, textured look. Allow to dry completely before unraveling for defined curls.</p>
      
      <h2>Common Challenges and Solutions</h2>
      
      <h3>Dryness</h3>
      <p>Combat dryness with regular deep conditioning, sealing with oils, and using the LOC (Liquid, Oil, Cream) method for styling.</p>
      
      <h3>Breakage</h3>
      <p>Minimize breakage by avoiding heat styling, using gentle detangling techniques, and maintaining moisture levels.</p>
      
      <h3>Frizz</h3>
      <p>Control frizz by using products with hold, avoiding touching your hair while it dries, and incorporating anti-humectants in humid weather.</p>
      
      <h2>Professional Tips</h2>
      <p>Consider consulting with a stylist who specializes in natural hair for personalized advice and techniques. Regular trims help maintain healthy ends and prevent split ends from traveling up the hair shaft.</p>
    `,
    tags: ['Hair Care', 'Natural Hair', 'Beauty Tips'],
    category: 'Hair Care',
    readTime: '5 min read'
  },
  {
    id: '5',
    slug: 'sustainable-beauty',
    title: 'Sustainable Beauty: Making Eco-Friendly Choices',
    date: '2024-02-20',
    author: 'James Wilson',
    coverImage: 'https://picsum.photos/seed/sustainable1/800/600',
    excerpt: 'Discover how to make eco-friendly choices in your beauty routine and reduce your environmental impact.',
    content: `
      <h2>Understanding Sustainable Beauty</h2>
      <p>Sustainable beauty involves making choices that minimize environmental impact, from product ingredients to packaging and disposal.</p>
      
      <h2>Eco-Friendly Ingredients</h2>
      
      <h3>Natural and Organic</h3>
      <p>Look for products with natural and organic ingredients, which are often grown without harmful pesticides and chemicals.</p>
      
      <h3>Avoid Harmful Ingredients</h3>
      <p>Steer clear of ingredients like parabens, sulfates, and synthetic fragrances, which can harm both your skin and the environment.</p>
      
      <h2>Sustainable Packaging</h2>
      
      <h3>Recyclable and Biodegradable</h3>
      <p>Choose products with recyclable or biodegradable packaging to reduce waste. Many brands now offer refillable options to minimize packaging.</p>
      
      <h3>Minimal Packaging</h3>
      <p>Opt for products with minimal packaging or those that use recycled materials.</p>
      
      <h2>DIY Beauty</h2>
      <p>Consider making your own beauty products using natural ingredients. This not only reduces packaging waste but also allows you to control what goes into your products.</p>
      
      <h2>Supporting Sustainable Brands</h2>
      <p>Research brands that prioritize sustainability in their practices, from sourcing ingredients to manufacturing and packaging.</p>
      
      <h2>Reducing Water Usage</h2>
      <p>Be mindful of water usage in your beauty routine. Turn off the tap while brushing your teeth or washing your face, and consider waterless beauty products.</p>
      
      <h2>Disposal and Recycling</h2>
      <p>Properly dispose of beauty products and packaging. Many brands offer recycling programs for their products, so take advantage of these opportunities.</p>
      
      <h2>Conclusion</h2>
      <p>Making sustainable choices in your beauty routine is a small but impactful way to contribute to environmental conservation. Start by incorporating eco-friendly products and practices into your daily routine.</p>
    `,
    tags: ['Sustainable Beauty', 'Eco-Friendly', 'Beauty Tips'],
    category: 'Sustainable Beauty',
    readTime: '4 min read'
  },
  {
    id: '6',
    slug: 'brow-styling-techniques',
    title: 'Master the Art of Brow Styling: Techniques for Perfect Arches',
    date: '2024-04-01',
    author: 'Sophia Garcia',
    coverImage: 'https://picsum.photos/seed/brows1/800/600',
    excerpt: 'Learn professional brow styling techniques to frame your face and enhance your natural beauty with perfectly shaped arches.',
    content: `
      <h2>Understanding Your Natural Brow Shape</h2>
      <p>The perfect brows begin with understanding your natural shape. Everyone's brows have three key points: the head (inner corner), the arch (highest point), and the tail (outer corner). Identifying these points on your own brows is essential before you start grooming.</p>
      
      <h3>Finding Your Ideal Shape</h3>
      <p>To find where your brows should start, hold a pencil vertically against the side of your nose. Where the pencil meets your brow is ideally where the head should begin. For your arch, angle the pencil from your nostril through the center of your eye. The point where it crosses your brow is your ideal arch location. Finally, angle the pencil from your nostril to the outer corner of your eye to find where your tail should end.</p>
      
      <h2>Brow Mapping Technique</h2>
      <p>Brow mapping is a professional technique that creates a blueprint for perfectly balanced brows. Using a white pencil or concealer, mark the start, arch, and endpoint of each brow based on your facial structure. This visual guide helps ensure symmetry before you start tweezing, waxing, or filling.</p>
      
      <h2>Grooming Methods</h2>
      
      <h3>Tweezing</h3>
      <p>Tweezing offers precision and is ideal for maintaining your shape between professional services. Always tweeze after a shower when pores are open, and pull hairs in the direction of growth to minimize discomfort. Focus on obvious strays and maintain the map you've created.</p>
      
      <h3>Waxing</h3>
      <p>Professional waxing provides clean, defined lines and removes multiple hairs at once. For best results, grow your brows out for at least two weeks before waxing. Always have this service performed by a trained esthetician who understands face-framing techniques.</p>
      
      <h3>Threading</h3>
      <p>Threading is an ancient technique that provides precise hair removal without chemicals. It's excellent for sensitive skin and creating clean, defined shapes. Like waxing, it's best performed by a skilled professional.</p>
      
      <h2>Filling Techniques by Brow Type</h2>
      
      <h3>Sparse Brows</h3>
      <p>For sparse brows, use a fine-tipped brow pencil to create hair-like strokes in bare areas. Layer a brow powder over the top to add dimension and help the drawn-on hairs blend with your natural ones. Finish with a clear gel to set everything in place.</p>
      
      <h3>Thick Brows</h3>
      <p>Those blessed with thick brows need minimal filling. Focus on defining the shape with a brow pencil only where needed, then use a tinted gel to tame and set the hairs in place.</p>
      
      <h3>Over-Plucked Brows</h3>
      <p>Growing back over-plucked brows requires patience. In the meantime, use a combination of pencil and powder to create the illusion of fullness. Consider a growth serum to help speed up the process.</p>
      
      <h2>Advanced Brow Styling Techniques</h2>
      
      <h3>Brow Lamination</h3>
      <p>This semi-permanent technique restructures brow hairs to stay brushed up and in place for 6-8 weeks. It creates a fluffy, full appearance even for those with sparse or unruly brows.</p>
      
      <h3>Ombré Brows</h3>
      <p>Create a gradient effect by making the inner portion of your brows lighter and gradually intensifying the color toward the tail. This mimics the natural variance in brow density and creates a soft yet defined look.</p>
      
      <h3>Soap Brows</h3>
      <p>This technique uses glycerin soap to set brows in a brushed-up, textured position. Simply wet a clean spoolie, run it over a bar of glycerin soap, then brush through your brows for all-day hold without stiffness.</p>
      
      <h2>Choosing the Right Products</h2>
      <p>Select products based on your desired finish. Pencils provide precision, powders offer a soft look, pomades give definition and longevity, while gels add texture and hold. For the most natural appearance, choose colors that match your hair roots rather than the ends, and go one shade lighter if you have very dark hair.</p>
    `,
    tags: ['Brows', 'Beauty Tips', 'Styling'],
    category: 'Brows',
    readTime: '7 min read'
  },
  {
    id: '7',
    slug: 'facial-treatments-guide',
    title: "The Ultimate Guide to Facial Treatments: What's Right for Your Skin?",
    date: '2024-04-10',
    author: 'Dr. Sarah Johnson',
    coverImage: 'https://picsum.photos/seed/facial1/800/600',
    excerpt: 'Navigate the world of facial treatments with our comprehensive guide to finding the perfect procedure for your unique skin concerns.',
    content: `
      <h2>Understanding Professional Facials</h2>
      <p>Professional facials go beyond what at-home treatments can achieve, offering deeper cleansing, professional-grade exfoliation, and targeted treatments for specific skin concerns. Regular facials can improve skin texture, clarity, and overall health when performed by licensed estheticians or dermatologists.</p>
      
      <h2>Classic Facial Treatments</h2>
      
      <h3>Basic European Facial</h3>
      <p>The European facial is a great starting point, typically including cleansing, exfoliation, steam, extractions, massage, a mask, and moisturizer. This treatment addresses multiple skin concerns and provides a foundation for more specialized treatments.</p>
      
      <h3>Deep Cleansing Facial</h3>
      <p>Focused on thorough pore cleansing, this treatment uses steam, exfoliation, and extensive extractions to remove debris and excess oil. It's ideal for oily, acne-prone, or congested skin.</p>
      
      <h3>Hydrating Facial</h3>
      <p>Designed for dry or dehydrated skin, hydrating facials incorporate moisture-boosting serums, masks, and gentle exfoliation. These treatments often include hyaluronic acid, glycerin, and other humectants to draw moisture into the skin.</p>
      
      <h2>Advanced Facial Treatments</h2>
      
      <h3>Chemical Peels</h3>
      <p>Chemical peels use acids to remove dead skin cells and stimulate new cell turnover. Options range from gentle lactic acid peels to medium-depth glycolic or salicylic acid peels, up to deeper TCA peels. The strength determines downtime and results, with deeper peels offering more dramatic improvements but requiring recovery time.</p>
      
      <h3>Microdermabrasion</h3>
      <p>This mechanical exfoliation method uses crystals or a diamond tip to remove dead skin cells and stimulate collagen production. It's ideal for improving texture, reducing mild scarring, and addressing sun damage or fine lines.</p>
      
      <h3>Oxygen Facial</h3>
      <p>Oxygen facials infuse the skin with pure oxygen alongside specialized serums containing hyaluronic acid, vitamins, and antioxidants. This treatment hydrates, plumps, and brightens the skin with no downtime, making it popular before special events.</p>
      
      <h3>LED Light Therapy</h3>
      <p>Using different wavelengths of light, LED therapy targets specific skin concerns: blue light for acne-causing bacteria, red light for inflammation and collagen production, and near-infrared for deeper healing. This gentle, non-invasive treatment works well for sensitive skin types.</p>
      
      <h2>Specialized Facial Treatments</h2>
      
      <h3>HydraFacial</h3>
      <p>This multi-step treatment combines cleansing, exfoliation, extraction, and hydration using a specialized device. It infuses the skin with serums tailored to your concerns while simultaneously removing debris from pores. The result is immediate improvement in skin clarity and radiance with no downtime.</p>
      
      <h3>Radiofrequency Facial</h3>
      <p>Using RF energy to heat the deeper skin layers, this treatment stimulates collagen and elastin production for natural tightening and contouring. Results build gradually over several sessions, with improvements in skin laxity and fine lines.</p>
      
      <h3>Microcurrent Facial</h3>
      <p>Sometimes called a "non-surgical facelift," microcurrent facials use low-level electrical currents to stimulate facial muscles and energize cells. The treatment lifts, tones, and contours while improving product penetration.</p>
      
      <h2>Choosing the Right Treatment for Your Skin Type</h2>
      
      <h3>Oily/Acne-Prone Skin</h3>
      <p>Look for deep cleansing facials, salicylic acid peels, blue LED therapy, or treatments specifically designed for acne. Regular professional extractions can also help prevent breakouts.</p>
      
      <h3>Dry/Sensitive Skin</h3>
      <p>Opt for gentle hydrating facials, oxygen treatments, mild enzyme exfoliation, or LED red light therapy. Avoid aggressive peels or treatments with potential irritants.</p>
      
      <h3>Aging Skin</h3>
      <p>Consider radiofrequency treatments, microcurrent facials, medium-depth peels, or facials incorporating vitamin C, retinol, or peptides. Consistency is key for addressing age-related concerns.</p>
      
      <h3>Hyperpigmented Skin</h3>
      <p>Seek treatments containing brightening ingredients like vitamin C, niacinamide, or alpha arbutin. Gentle chemical peels and LED therapy can also help even skin tone.</p>
      
      <h2>Preparing for Your Facial</h2>
      <p>Avoid retinoids, exfoliants, or any potentially irritating products for 2-3 days before your treatment. Come with clean skin (no makeup), and be prepared to discuss your skincare routine and concerns with your esthetician. For best results, book regular treatments as recommended by your skincare professional, typically every 4-6 weeks.</p>
    `,
    tags: ['Facials', 'Skincare', 'Professional Advice'],
    category: 'Facials',
    readTime: '8 min read'
  },
  {
    id: '8',
    slug: 'natural-beauty-ingredients',
    title: 'Natural Beauty Ingredients: From Kitchen to Skincare',
    date: '2024-02-20',
    author: 'Maya Patel',
    coverImage: 'https://picsum.photos/seed/natural1/800/600',
    excerpt: 'Discover how everyday ingredients from your kitchen can transform your beauty routine with effective, natural alternatives to commercial products.',
    content: `
      <h2>The Rise of Natural Beauty</h2>
      <p>As consumers become more ingredient-conscious, natural beauty solutions have gained tremendous popularity. Many effective skincare ingredients can be found right in your kitchen, offering simple, affordable alternatives to commercial products without synthetic chemicals or preservatives.</p>
      
      <h2>Powerful Kitchen Ingredients for Skin</h2>
      
      <h3>Honey</h3>
      <p>Raw honey is a natural humectant with antibacterial properties. It draws moisture into the skin while helping to clear blemishes and soothe inflammation. Use it as a mask on its own, or mix with other ingredients for added benefits.</p>
      
      <h3>Avocado</h3>
      <p>Rich in healthy fats and vitamins E and C, avocados nourish and hydrate the skin deeply. Mash a ripe avocado and apply directly to the face, or blend with honey for a moisturizing mask perfect for dry skin.</p>
      
      <h3>Oatmeal</h3>
      <p>Colloidal oatmeal soothes irritated skin, gently exfoliates, and helps maintain the skin's moisture barrier. Grind rolled oats into a fine powder, mix with water to form a paste, and apply to calm sensitive or eczema-prone skin.</p>
      
      <h3>Yogurt</h3>
      <p>The lactic acid in plain yogurt provides gentle exfoliation while its probiotics help balance skin's microbiome. Apply plain, unsweetened yogurt as a mask to brighten dull skin and improve texture.</p>
      
      <h3>Turmeric</h3>
      <p>This powerful anti-inflammatory spice brightens the complexion and helps even skin tone. Mix 1/4 teaspoon with honey or yogurt, but be careful as it can temporarily stain the skin (and permanently stain clothing).</p>
      
      <h2>Kitchen Remedies for Specific Concerns</h2>
      
      <h3>For Acne</h3>
      <p><strong>Tea Tree Oil + Honey Spot Treatment:</strong> Mix a drop of tea tree oil with a teaspoon of honey and apply directly to blemishes. Tea tree's antibacterial properties work alongside honey's healing benefits to reduce inflammation and speed healing.</p>
      
      <h3>For Dullness</h3>
      <p><strong>Papaya Enzyme Mask:</strong> Papaya contains papain, a natural enzyme that dissolves dead skin cells. Mash ripe papaya and apply for 10 minutes for a natural brightening effect similar to a gentle chemical exfoliant.</p>
      
      <h3>For Dry Skin</h3>
      <p><strong>Coconut Oil & Brown Sugar Scrub:</strong> Mix equal parts coconut oil and brown sugar for a moisturizing exfoliant that removes dead skin while infusing moisture. Massage gently onto damp skin, then rinse.</p>
      
      <h3>For Oily Skin</h3>
      <p><strong>Apple Cider Vinegar Toner:</strong> Dilute ACV with equal parts water to balance pH, control oil, and clear pores. Apply with a cotton pad after cleansing but before moisturizing.</p>
      
      <h3>For Under-Eye Circles</h3>
      <p><strong>Cold Cucumber Slices:</strong> The old classic works through a combination of cooling effects and mild astringent properties that temporarily tighten skin and reduce puffiness.</p>
      
      <h2>Natural Body Care</h2>
      
      <h3>Coffee Scrub</h3>
      <p>Used coffee grounds mixed with coconut oil create an invigorating scrub that may temporarily reduce the appearance of cellulite while exfoliating rough skin on areas like elbows and knees.</p>
      
      <h3>Coconut Oil Hair Mask</h3>
      <p>Warm coconut oil applied to the ends of dry hair or as a scalp treatment provides deep conditioning. Leave on for 30 minutes or overnight before shampooing.</p>
      
      <h3>Aloe Vera After-Sun Care</h3>
      <p>The gel from aloe leaves provides immediate relief for sunburned skin. Keep an aloe plant at home for fresh gel whenever needed.</p>
      
      <h2>Tips for Using Natural Ingredients</h2>
      
      <h3>Patch Test First</h3>
      <p>Even natural ingredients can cause reactions. Always test a small amount on your inner wrist and wait 24 hours before applying to your face or larger body areas.</p>
      
      <h3>Use Fresh Products</h3>
      <p>Without preservatives, natural remedies should be made in small batches and used immediately. Refrigerate any leftovers and use within 1-2 days.</p>
      
      <h3>Know the Limitations</h3>
      <p>While natural ingredients offer many benefits, they may not replace medically-necessary treatments for serious skin conditions. Consult a dermatologist for persistent concerns.</p>
      
      <h2>Complementing Commercial Products</h2>
      <p>Natural kitchen remedies work well alongside commercial skincare. Consider using natural options for occasional treatments while maintaining a core routine of well-formulated commercial products with proven active ingredients for chronic concerns.</p>
    `,
    tags: ['Natural Beauty', 'Skincare', 'DIY'],
    category: 'Skincare',
    readTime: '6 min read'
  },
  {
    id: '9',
    slug: 'nail-art-trends',
    title: 'Creative Nail Art Trends Taking Over Social Media',
    date: '2024-01-15',
    author: 'Jessica Lee',
    coverImage: 'https://picsum.photos/seed/nails1/800/600',
    excerpt: 'Explore the most innovative nail art trends dominating social feeds and how to recreate these eye-catching designs at home or in the salon.',
    content: `
      <h2>Evolution of Nail Art</h2>
      <p>Nail art has evolved from simple polishes to elaborate mini-canvases for self-expression. What was once limited to basic colors has transformed into a sophisticated art form showcasing incredible creativity and technical skill, with social media platforms driving innovation and accessibility.</p>
      
      <h2>Current Top Nail Art Trends</h2>
      
      <h3>Chrome and Metallic Finishes</h3>
      <p>Chrome powder finishes create a mirror-like, reflective surface that catches the light beautifully. From silver and gold to multidimensional holographic effects, these finishes add instant glamour to any nail look.</p>
      
      <h3>Negative Space Designs</h3>
      <p>These designs incorporate your natural nail as part of the art, creating graphic patterns that feel modern and architectural. This trend works on both short and long nails and can be as simple or complex as you prefer.</p>
      
      <h3>3D Texture and Embellishments</h3>
      <p>Dimensional nail art incorporates elements that rise from the nail surface, from subtle textures to more dramatic additions like crystals, dried flowers, or custom-made charms.</p>
      
      <h3>Gradient and Ombré</h3>
      <p>The blending of colors creates a dreamy effect that transitions from one shade to another. This versatile technique works with any color combination and can be the main focus or the background for other nail art elements.</p>
      
      <h3>Minimalist Art</h3>
      <p>Simple dots, lines, and abstract shapes on negative space or solid backgrounds make for sophisticated designs that are both stylish and wearable for everyday.</p>
      
      <h2>Seasonal Trending Designs</h2>
      
      <h3>Spring</h3>
      <p>Pastels with floral accents, cherry blossoms, and delicate watercolor designs bring the season to your fingertips. Try transparent jelly finishes for a fresh, dewy look.</p>
      
      <h3>Summer</h3>
      <p>Bright citrus colors, tropical patterns, and beach-inspired designs like waves and sunsets capture summer vibes. Neon accents and fruit motifs are particularly popular.</p>
      
      <h3>Fall</h3>
      <p>Rich earth tones, matte finishes, and designs inspired by falling leaves translate autumn's palette to nails. Consider tortoiseshell patterns or deep jewel tones.</p>
      
      <h3>Winter</h3>
      <p>Incorporate festive elements like glitter, snowflakes, and metallics. Deep velvety finishes and icy blue designs capture winter's essence.</p>
      
      <h2>Technical Innovations</h2>
      
      <h3>Gel Extensions</h3>
      <p>Compared to traditional acrylics, gel extensions offer a lighter feel and more natural appearance while providing a flawless canvas for elaborate nail art. They've become the preferred base for many nail artists creating detailed designs.</p>
      
      <h3>Magnetic Polishes</h3>
      <p>These special formulas contain metallic particles that can be manipulated with a magnet to create stunning patterns like cat eye effects or geometric designs without requiring detailed painting skills.</p>
      
      <h3>Stamping</h3>
      <p>Nail stamping plates allow for precise, complex patterns to be transferred onto the nail in seconds. This technique has democratized intricate nail art, making it achievable even for beginners.</p>
      
      <h2>DIY vs. Professional Approaches</h2>
      
      <h3>DIY-Friendly Trends</h3>
      <p>Techniques like color blocking, simple French tips with colorful twists, and dotting designs can be achieved at home with basic tools. Press-on nails have also evolved, with many artists creating custom sets for at-home application.</p>
      
      <h3>Pro-Level Techniques</h3>
      <p>Detailed hand-painting, perfect ombré gradients, and encapsulated designs (where elements are sealed within the nail enhancement) typically require professional skills and materials. These techniques are worth the salon visit for special occasions.</p>
      
      <h2>Nail Care Alongside Art</h2>
      <p>Beautiful nail art starts with healthy nails. Maintain a regular routine of gentle filing, cuticle oil application, and breaks between enhancement services. Even the most stunning design won't look its best on damaged nails, so prioritize nail health alongside artistic expression.</p>
      
      <h2>Finding Inspiration</h2>
      <p>Save images that catch your eye from social media platforms. Bring these references to your nail technician, who can adapt them to your nail shape and length. Many nail artists appreciate when clients come prepared with inspiration photos rather than vague descriptions.</p>
    `,
    tags: ['Nail Art', 'Beauty Trends', 'Styling'],
    category: 'Trends',
    readTime: '5 min read'
  },
  {
    id: '10',
    slug: 'chemical-peels-explained',
    title: 'Chemical Peels Explained: Types, Benefits, and What to Expect',
    date: '2024-02-05',
    author: 'Dr. Sarah Johnson',
    coverImage: 'https://picsum.photos/seed/peels1/800/600',
    excerpt: 'A comprehensive guide to understanding chemical peels, their benefits for various skin concerns, and how to prepare for and recover from these transformative treatments.',
    content: `
      <h2>What Are Chemical Peels?</h2>
      <p>Chemical peels are facial treatments that use controlled applications of acids to remove damaged outer layers of skin. This exfoliation process reveals fresher, smoother skin underneath and stimulates cell regeneration. The depth of the peel determines both the results and recovery time required.</p>
      
      <h2>Types of Chemical Peels</h2>
      
      <h3>Superficial Peels</h3>
      <p>These mild peels use alpha-hydroxy acids (AHAs) like glycolic or lactic acid, or beta-hydroxy acids (BHAs) like salicylic acid at concentrations typically between 20-30%. They penetrate only the outermost layer of skin (epidermis) and cause minimal downtime—usually just mild redness and flaking for 1-3 days.</p>
      
      <p><strong>Best for:</strong> Mild discoloration, rough texture, dullness, and mild acne. These gentle peels can be performed every 2-4 weeks as part of a regular maintenance regimen.</p>
      
      <h3>Medium-Depth Peels</h3>
      <p>These peels typically use higher concentrations of AHAs and BHAs (30-50%) or TCA (trichloroacetic acid) at concentrations of 15-35%. They penetrate into the upper part of the dermis (middle skin layer) and require more downtime—typically 5-7 days of noticeable peeling and redness.</p>
      
      <p><strong>Best for:</strong> More pronounced hyperpigmentation, moderate sun damage, fine lines, acne scars, and melasma. These peels are usually performed every 3-6 months.</p>
      
      <h3>Deep Peels</h3>
      <p>Deep peels use phenol or high-concentration TCA (35-50%) to penetrate into the mid-dermis. These powerful treatments are performed by physicians only and require significant downtime—often 10-14 days of intense peeling, redness, and swelling. They're typically a one-time treatment due to their intensity.</p>
      
      <p><strong>Best for:</strong> Deeper wrinkles, more severe sun damage, deeper acne scars, and precancerous growths. Results can last for years.</p>
      
      <h2>Benefits of Chemical Peels</h2>
      
      <h3>Improves Skin Texture</h3>
      <p>By removing dead skin cells and stimulating new cell growth, peels reveal smoother, more refined skin with a more even texture. This benefit is seen across all peel depths, with deeper peels providing more dramatic improvements.</p>
      
      <h3>Reduces Hyperpigmentation</h3>
      <p>Chemical peels are excellent for addressing sun spots, age spots, melasma, and post-inflammatory hyperpigmentation. The exfoliation removes pigmented cells while ingredients like kojic acid or arbutin in certain peel formulations target melanin production.</p>
      
      <h3>Minimizes Fine Lines and Wrinkles</h3>
      <p>Medium and deep peels stimulate collagen production, which helps fill in fine lines over time. The immediate exfoliation also smooths the skin's surface, making fine lines less noticeable even before the collagen-building effects take place.</p>
      
      <h3>Clears Acne and Reduces Scarring</h3>
      <p>Salicylic acid peels are particularly effective for acne, as this oil-soluble acid can penetrate into pores to clear congestion. Regular peels can help manage breakouts while gradually improving the appearance of acne scars.</p>
      
      <h3>Enhances Product Penetration</h3>
      <p>By removing the barrier of dead skin cells, peels allow subsequent skincare products to penetrate more effectively, maximizing their benefits.</p>
      
      <h2>Preparing for a Chemical Peel</h2>
      
      <h3>Pre-Peel Consultation</h3>
      <p>Always begin with a thorough consultation with your esthetician or dermatologist. They'll evaluate your skin type, concerns, and medical history to recommend the appropriate peel type and strength. Be prepared to discuss all medications and skincare products you use regularly.</p>
      
      <h3>Pre-Peel Skincare</h3>
      <p>For optimal results and minimal complications, follow your provider's pre-peel instructions carefully. Typically, this includes:</p>
      <ul>
        <li>Discontinuing retinoids, exfoliants, and other active ingredients 3-7 days before treatment</li>
        <li>Avoiding sun exposure and using SPF 30+ daily</li>
        <li>In some cases, pre-treating with hydroquinone or other brightening agents to prevent post-inflammatory hyperpigmentation (especially for darker skin tones)</li>
      </ul>
      
      <h2>The Chemical Peel Experience</h2>
      
      <h3>During the Treatment</h3>
      <p>A typical peel appointment includes:</p>
      <ol>
        <li>Thorough cleansing to remove oils and debris</li>
        <li>Application of a peel prep solution to degrease the skin</li>
        <li>Application of the peel solution with a brush, gauze, or cotton applicator</li>
        <li>A timer to monitor the exposure time (usually 2-10 minutes depending on peel type)</li>
        <li>Neutralization of the acid (if required by the specific formulation)</li>
        <li>Application of soothing, calming products and sunscreen</li>
      </ol>
      
      <p>You'll likely feel tingling, warmth, or mild stinging during the application. Deeper peels may require pain management approaches including numbing creams or even sedation for phenol peels.</p>
      
      <h3>Post-Peel Recovery</h3>
      <p>Immediately after the peel, your skin will look anywhere from slightly pink (superficial peels) to quite red or even white-frosted (deeper peels). Your provider will give specific aftercare instructions, which typically include:</p>
      <ul>
        <li>Gentle cleansing with non-irritating cleansers</li>
        <li>Liberal application of moisturizer and sunscreen</li>
        <li>Avoiding picking or peeling at flaking skin</li>
        <li>Avoiding sun exposure</li>
        <li>Postponing makeup application for a specified period</li>
      </ul>
      
      <h2>Who Should Avoid Chemical Peels</h2>
      <p>Chemical peels aren't suitable for everyone. Exercise caution if you:</p>
      <ul>
        <li>Are pregnant or nursing</li>
        <li>Have a history of keloid scarring</li>
        <li>Have taken isotretinoin (Accutane) within the past 6-12 months</li>
        <li>Have active cold sores, open wounds, or sunburn</li>
        <li>Have very sensitive or reactive skin conditions like rosacea (though very gentle lactic acid peels may be suitable)</li>
      </ul>
      
      <h2>Professional vs. At-Home Peels</h2>
      <p>While professional-grade peels offer more dramatic results, many at-home options can provide gentle exfoliation benefits. At-home peels typically contain lower concentrations of acids (5-15%) and are designed for safer self-application. They're a good option for maintaining results between professional treatments but can't replace the transformative effects of higher-strength peels administered by trained professionals.</p>
    `,
    tags: ['Peels', 'Skincare', 'Professional Advice'],
    category: 'Peels',
    readTime: '8 min read'
  },
  {
    id: '11',
    slug: 'sustainable-beauty-practices',
    title: 'Sustainable Beauty: Eco-Friendly Practices for a Greener Routine',
    date: '2024-01-30',
    author: 'Emma Thompson',
    coverImage: 'https://picsum.photos/seed/sustain1/800/600',
    excerpt: 'Discover practical ways to make your beauty routine more sustainable without sacrificing effectiveness or luxury, from product choices to water conservation.',
    content: `
      <h2>The Environmental Impact of Beauty</h2>
      <p>The beauty industry generates significant environmental challenges, from plastic packaging waste to water pollution from chemical ingredients. Single-use products, excessive packaging, and resource-intensive manufacturing processes all contribute to beauty's environmental footprint. However, the industry is evolving, with many brands pioneering sustainable alternatives and consumers increasingly demanding eco-friendly options.</p>
      
      <h2>Sustainable Product Choices</h2>
      
      <h3>Packaging Considerations</h3>
      <p>Look for brands using recycled or biodegradable packaging, offering refill programs, or eliminating packaging entirely with solid formulations. Glass and aluminum containers are infinitely recyclable compared to plastic, which degrades in quality with each recycling cycle. Some innovative brands now use plant-based bioplastics or compostable packaging materials.</p>
      
      <h3>Ingredient Sourcing</h3>
      <p>Sustainable beauty considers not just what ingredients do for your skin but how they impact the planet. Look for:</p>
      <ul>
        <li>Organic ingredients grown without pesticides or chemical fertilizers</li>
        <li>Fair trade certification ensuring ethical sourcing practices</li>
        <li>Palm oil-free formulations (or certified sustainable palm oil)</li>
        <li>Locally sourced ingredients that reduce transportation emissions</li>
      </ul>
      
      <h3>Multi-Use Products</h3>
      <p>Products that serve multiple purposes—like tinted moisturizers with SPF or cheek and lip tints—reduce the total number of products needed. This minimizes packaging waste and resource consumption while simplifying your routine.</p>
      
      <h2>Sustainable Beauty Routines</h2>
      
      <h3>Water Conservation</h3>
      <p>The average beauty routine uses significant water, both directly and in product manufacturing. Reduce your water footprint by:</p>
      <ul>
        <li>Taking shorter showers</li>
        <li>Turning off the tap while cleansing your face</li>
        <li>Using micellar water or cleansing balms that don't require rinsing</li>
        <li>Choosing concentrated products that use less water in formulation</li>
      </ul>
      
      <h3>Energy-Efficient Styling</h3>
      <p>Heat styling tools consume substantial electricity. Embrace more sustainable approaches by:</p>
      <ul>
        <li>Air-drying hair when possible</li>
        <li>Using heat-styling tools on lower settings</li>
        <li>Investing in energy-efficient appliances</li>
        <li>Embracing your natural texture with heat-free styling methods</li>
      </ul>
      
      <h3>Mindful Consumption</h3>
      <p>Perhaps the most sustainable practice is simply buying less. Before purchasing, ask yourself:</p>
      <ul>
        <li>Do I already own something similar?</li>
        <li>Will I use this product entirely before it expires?</li>
        <li>Could I achieve similar results with products I already own?</li>
        <li>Is this addressing a genuine need rather than a passing trend?</li>
      </ul>
      
      <h2>Sustainable Makeup Practices</h2>
      
      <h3>Clean Beauty Tools</h3>
      <p>Consider the environmental impact of your beauty tools. Opt for brushes with sustainable bamboo handles and synthetic bristles (rather than animal hair). Clean and maintain your tools properly to extend their lifespan. For disposable items like cotton pads, switch to reusable alternatives made from organic cotton or bamboo.</p>
      
      <h3>Recycling Cosmetic Packaging</h3>
      <p>Cosmetic packaging often contains multiple materials that require separation for proper recycling. Some steps to ensure your empties don't end up in landfill:</p>
      <ul>
        <li>Check if the brand has a take-back program (many department store brands do)</li>
        <li>Clean containers thoroughly before recycling</li>
        <li>Separate components made of different materials</li>
        <li>Check with your local recycling program about which items they accept</li>
      </ul>
      
      <h3>DIY and Natural Alternatives</h3>
      <p>For some products, effective natural alternatives can be made at home, reducing packaging waste entirely. Simple DIY options include:</p>
      <ul>
        <li>Brown sugar and honey lip scrub</li>
        <li>Oatmeal and yogurt face mask</li>
        <li>Aloe vera gel as hair styling product</li>
        <li>Coconut oil as makeup remover</li>
      </ul>
      
      <h2>Sustainable Haircare</h2>
      
      <h3>Waterless and Solid Formulations</h3>
      <p>Solid shampoo and conditioner bars eliminate plastic packaging and contain concentrated ingredients without added water. A single shampoo bar can replace 2-3 bottles of liquid shampoo, significantly reducing your plastic footprint.</p>
      
      <h3>Low-Waste Coloring Options</h3>
      <p>Hair coloring typically generates significant waste. More sustainable approaches include:</p>
      <ul>
        <li>Extending time between coloring sessions</li>
        <li>Using plant-based dyes like henna for permanent color</li>
        <li>Trying temporary color products that wash out</li>
        <li>Finding salons that use ammonia-free, PPD-free, or natural color lines</li>
      </ul>
      
      <h2>Making the Transition</h2>
      <p>Transitioning to a sustainable beauty routine doesn't happen overnight. Start by making small changes as your current products run out, rather than discarding usable products prematurely. Research alternatives before purchasing, and remember that sustainability exists on a spectrum—it's about progress, not perfection.</p>
      
      <h3>Greenwashing Awareness</h3>
      <p>As demand for sustainable products grows, so does "greenwashing"—misleading claims about environmental benefits. Look beyond marketing terms like "natural" or "green" (which have no regulated definitions) and research brands' specific practices around sourcing, manufacturing, and packaging.</p>
      
      <h2>The Future of Sustainable Beauty</h2>
      <p>The beauty industry is innovating rapidly, with emerging technologies like waterless formulations, carbon-neutral manufacturing, and plastic alternatives made from algae or agricultural waste. By supporting brands pioneering these sustainable practices, consumers help drive wider adoption of eco-friendly approaches throughout the industry.</p>
    `,
    tags: ['Sustainability', 'Beauty Tips', 'Eco-Friendly'],
    category: 'Beauty Tips',
    readTime: '7 min read'
  }
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  )
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getBlogPostsByCategoryOrTag(categoryOrTag: string): BlogPost[] {
  return [...blogPosts]
    .filter(post =>
      post.category.toLowerCase() === categoryOrTag.toLowerCase() ||
      post.tags.some(tag => tag.toLowerCase() === categoryOrTag.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
}

export function searchBlogPosts(query: string): BlogPost[] {
  const searchTerms = query.toLowerCase().split(' ');

  return [...blogPosts]
    .filter(post =>
      searchTerms.some(term =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term)) ||
        post.category.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term)
      )
    )
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
}

export function getRelatedPosts(post: BlogPost, limit: number = 3): BlogPost[] {
  // Find posts with the same category or tags
  return [...blogPosts]
    .filter(p =>
      p.id !== post.id && (
        p.category === post.category ||
        p.tags.some(tag => post.tags.includes(tag))
      )
    )
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
    .slice(0, limit)
}

export function getAllCategories(): string[] {
  const categories = new Set(blogPosts.map(post => post.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const tags = new Set(blogPosts.flatMap(post => post.tags));
  return Array.from(tags).sort();
}
