"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowLeft, User, Tag, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";

const BLOG_POSTS = [
  {
    id: "1",
    title: "10 Hair Care Tips for Healthy, Shiny Hair",
    excerpt: "Discover the secrets to maintaining gorgeous, healthy hair with these expert-approved tips from our professional stylists.",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200&q=80",
    category: "Hair Care",
    author: "Ayesha Khan",
    date: "Nov 10, 2024",
    readTime: "5 min read",
    content: `
      <p>Taking care of your hair doesn't have to be complicated. With the right approach and consistent care, you can achieve healthy, shiny hair that turns heads wherever you go. Whether you have straight, wavy, curly, or coily hair, these tips will help you maintain gorgeous locks.</p>

      <h2>1. Choose the Right Shampoo for Your Hair Type</h2>
      <p>Not all shampoos are created equal. The first step to healthy hair is selecting a shampoo that matches your specific hair type and concerns. If you have oily hair, look for clarifying shampoos with ingredients like tea tree oil. For dry or damaged hair, opt for moisturizing formulas with argan oil or keratin.</p>
      <p>Color-treated hair requires sulfate-free shampoos to prevent fading, while curly hair benefits from cream-based cleansers that don't strip natural oils. Visit our salon for a professional hair analysis and personalized product recommendations.</p>

      <h2>2. Don't Overwash Your Hair</h2>
      <p>Washing your hair every day can strip it of natural oils that keep it healthy and shiny. These natural oils, called sebum, are essential for protecting your hair and scalp. Try to wash your hair 2-3 times a week for optimal health.</p>
      <p>On non-wash days, use dry shampoo to absorb excess oil and refresh your style. This allows your scalp's natural oils to nourish your hair from root to tip. If you exercise frequently, rinse with water and use conditioner on the ends.</p>

      <h2>3. Use Conditioner Properly</h2>
      <p>Many people apply conditioner incorrectly, which can lead to greasy roots or dry ends. The proper technique is to apply conditioner from mid-length to the ends of your hair, completely avoiding the roots and scalp area.</p>
      <p>Leave it on for 2-3 minutes to allow the ingredients to penetrate the hair shaft. For extra conditioning, use a wide-tooth comb to distribute the product evenly. Rinse thoroughly with cool water to seal the cuticles and add shine.</p>

      <h2>4. Protect from Heat Damage</h2>
      <p>Heat styling tools can reach temperatures up to 450°F, which can severely damage your hair's protein structure. Always apply a heat protectant spray or serum before using any hot tools. These products create a barrier that helps prevent moisture loss and damage.</p>
      <p>Try to limit heat styling to 2-3 times per week and always use the lowest effective temperature. Invest in quality tools with adjustable heat settings and ceramic plates for even heat distribution. Let your hair air dry whenever possible.</p>

      <h2>5. Get Regular Trims Every 6-8 Weeks</h2>
      <p>Regular trims are essential for maintaining healthy hair, even if you're growing it out. Split ends can travel up the hair shaft, causing more damage and breakage. Visiting your stylist every 6-8 weeks prevents this and keeps your hair looking fresh and healthy.</p>
      <p>During your appointment, ask your stylist about the best styles and cuts for your hair type and face shape. At Glamour Studio, our expert stylists can recommend the perfect trim schedule for your hair goals.</p>

      <h2>6. Eat a Balanced Diet Rich in Hair Nutrients</h2>
      <p>Healthy hair starts from within. Your diet plays a crucial role in hair health and growth. Include plenty of protein (the building block of hair), omega-3 fatty acids (found in fish and nuts), and vitamins A, C, and E.</p>
      <p>Foods like eggs, salmon, spinach, sweet potatoes, berries, and avocados are excellent for promoting hair growth and shine. Consider taking biotin or hair-specific supplements if your diet lacks these nutrients, but always consult with a healthcare professional first.</p>

      <h2>7. Stay Hydrated Throughout the Day</h2>
      <p>Drinking plenty of water is one of the simplest yet most effective ways to maintain healthy hair. Hydration is crucial for maintaining a healthy scalp and keeping your hair moisturized from the inside out.</p>
      <p>Aim for at least 8 glasses of water daily. Dehydration can lead to dry, brittle hair that's prone to breakage. You'll notice the difference in your hair's texture and shine when you're properly hydrated.</p>

      <h2>8. Use Deep Conditioning Hair Masks Weekly</h2>
      <p>Apply a deep conditioning or hair mask treatment once a week to provide extra moisture and nutrients. These intensive treatments penetrate deeper than regular conditioner, repairing damage and restoring shine.</p>
      <p>Look for masks with ingredients like coconut oil, shea butter, or protein treatments. Apply to damp hair, cover with a shower cap, and leave on for 15-30 minutes. For even better results, apply gentle heat with a hair dryer over the cap.</p>

      <h2>9. Be Gentle When Brushing Wet Hair</h2>
      <p>Wet hair is more vulnerable to breakage because it's in its weakest state. Never brush wet hair with a regular brush. Instead, use a wide-toothed comb or a specialized wet brush designed to minimize breakage.</p>
      <p>Start from the ends and work your way up to the roots, gently detangling as you go. This prevents unnecessary tension and breakage. Apply a leave-in conditioner or detangling spray to make the process easier.</p>

      <h2>10. Protect Your Hair While Sleeping</h2>
      <p>Believe it or not, your pillowcase can affect your hair health. Cotton pillowcases create friction that can lead to breakage and frizz. Switch to a silk or satin pillowcase to reduce friction and prevent hair damage while you sleep.</p>
      <p>Alternatively, wrap your hair in a silk scarf or use a silk bonnet. For long hair, try a loose braid or bun to prevent tangling. These simple nighttime habits can make a significant difference in your hair's health and appearance.</p>

      <h2>Bonus Tips for Extra Shine</h2>
      <p><strong>Cold Water Rinse:</strong> Finish your shower with a cold water rinse to seal the hair cuticles and boost shine.</p>
      <p><strong>Avoid Tight Hairstyles:</strong> Constantly wearing tight ponytails or buns can cause traction alopecia and breakage.</p>
      <p><strong>Protect from Sun:</strong> UV rays can damage hair just like skin. Wear a hat or use UV-protectant hair products in summer.</p>
      <p><strong>Minimize Chemical Treatments:</strong> Space out coloring, perming, or relaxing treatments to give your hair time to recover.</p>

      <p><strong>Conclusion:</strong> Following these simple tips consistently will help you achieve the healthy, shiny hair you've always wanted. Remember, good hair care is a marathon, not a sprint! Be patient and consistent with your routine, and you'll see amazing results in just a few weeks.</p>
      
      <p>Visit Glamour Studio for a personalized hair consultation and let our expert stylists create a custom hair care plan just for you!</p>
    `
  },
  {
    id: "2",
    title: "Bridal Makeup Trends for 2025",
    excerpt: "Stay ahead of the curve with the hottest bridal makeup trends that will make you look stunning on your special day.",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1200&q=80",
    category: "Bridal",
    author: "Sara Ahmed",
    date: "Nov 8, 2024",
    readTime: "7 min read",
    content: `
      <p>Your wedding day is one of the most important days of your life, and your makeup should be nothing short of perfect. Let's explore the top bridal makeup trends for 2025.</p>

      <h2>Natural Glam is Here to Stay</h2>
      <p>The "no-makeup" makeup look continues to dominate, with brides opting for fresh, dewy skin that looks naturally radiant.</p>

      <h2>Bold Lips Make a Comeback</h2>
      <p>After years of nude lips, bold red and berry tones are making a stunning return to bridal makeup.</p>

      <h2>Luminous Skin</h2>
      <p>Glowing, healthy-looking skin is the foundation of 2025 bridal looks. Focus on skincare in the months leading up to your wedding.</p>

      <h2>Soft, Romantic Eyes</h2>
      <p>Soft smokey eyes with rose gold and champagne tones are perfect for creating a romantic bridal look.</p>

      <p><strong>Pro Tip:</strong> Always do a makeup trial at least 2 months before your wedding to ensure everything is perfect!</p>
    `
  },
  {
    id: "3",
    title: "Skincare Routine for Glowing Skin",
    excerpt: "Learn the perfect skincare routine that will give you radiant, glowing skin all year round with our expert advice.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
    category: "Skincare",
    author: "Maria Ali",
    date: "Nov 5, 2024",
    readTime: "6 min read",
    content: `
      <p>Achieving glowing skin isn't just about using expensive products—it's about consistency and using the right routine for your skin type.</p>

      <h2>Morning Routine</h2>
      <p><strong>1. Cleanser:</strong> Start with a gentle cleanser to remove any overnight buildup.</p>
      <p><strong>2. Toner:</strong> Balance your skin's pH with a hydrating toner.</p>
      <p><strong>3. Serum:</strong> Apply vitamin C serum for brightness and protection.</p>
      <p><strong>4. Moisturizer:</strong> Lock in hydration with a good moisturizer.</p>
      <p><strong>5. Sunscreen:</strong> Never skip SPF 50+ sunscreen, even on cloudy days.</p>

      <h2>Evening Routine</h2>
      <p><strong>1. Double Cleanse:</strong> Remove makeup with oil cleanser, then use regular cleanser.</p>
      <p><strong>2. Exfoliate:</strong> Use a gentle exfoliator 2-3 times per week.</p>
      <p><strong>3. Treatment:</strong> Apply retinol or other treatments.</p>
      <p><strong>4. Eye Cream:</strong> Gently pat eye cream around the eye area.</p>
      <p><strong>5. Night Cream:</strong> Use a rich night cream for overnight repair.</p>

      <p><strong>Remember:</strong> Consistency is key! Stick to your routine for at least 6-8 weeks to see real results.</p>
    `
  },
  {
    id: "4",
    title: "Best Hair Colors for Different Skin Tones",
    excerpt: "Find the perfect hair color that complements your skin tone and enhances your natural beauty.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
    category: "Hair Color",
    author: "Fatima Shah",
    date: "Nov 3, 2024",
    readTime: "5 min read",
    content: `
      <p>Choosing the right hair color can dramatically enhance your appearance. Here's a guide to help you find your perfect shade.</p>

      <h2>For Fair Skin Tones</h2>
      <p>Platinum blonde, ash brown, and cool-toned reds work beautifully with fair skin. Avoid colors that are too warm or golden.</p>

      <h2>For Medium Skin Tones</h2>
      <p>Caramel, honey blonde, chestnut brown, and rich auburn shades complement medium skin tones perfectly.</p>

      <h2>For Olive Skin Tones</h2>
      <p>Golden brown, warm chocolate, and rich burgundy tones look stunning on olive skin.</p>

      <h2>For Dark Skin Tones</h2>
      <p>Deep browns, black with subtle highlights, and bold colors like copper and burgundy work wonderfully.</p>

      <p><strong>Pro Tip:</strong> Always consult with a professional colorist before making a dramatic change!</p>
    `
  },
  {
    id: "5",
    title: "Nail Art Ideas That Are Trending Now",
    excerpt: "Get inspired by the latest nail art trends and designs that are taking the beauty world by storm.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
    category: "Nails",
    author: "Zara Khan",
    date: "Nov 1, 2024",
    readTime: "4 min read",
    content: `
      <p>Nail art has evolved from simple designs to intricate masterpieces. Here are the hottest trends you need to try.</p>

      <h2>Minimalist Line Art</h2>
      <p>Simple, elegant lines and geometric patterns on neutral backgrounds are perfect for everyday wear.</p>

      <h2>Chrome Nails</h2>
      <p>Metallic, mirror-like finishes in silver, gold, and rose gold continue to be popular.</p>

      <h2>French Tips with a Twist</h2>
      <p>Classic French manicures get a modern update with colored tips and creative shapes.</p>

      <h2>Negative Space Designs</h2>
      <p>Leave parts of your natural nail visible for a trendy, artistic look.</p>

      <h2>3D Elements</h2>
      <p>Small pearls, gems, and textured elements add dimension to your nails.</p>

      <p><strong>Maintenance Tip:</strong> Apply cuticle oil daily to keep your nails and nail art looking fresh!</p>
    `
  },
  {
    id: "6",
    title: "How to Choose the Right Haircut for Your Face Shape",
    excerpt: "Discover which haircut styles work best for your unique face shape and personality.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
    category: "Hair Care",
    author: "Ayesha Khan",
    date: "Oct 28, 2024",
    readTime: "6 min read",
    content: `
      <p>Understanding your face shape is the first step to finding the perfect haircut that enhances your best features.</p>

      <h2>Oval Face Shape</h2>
      <p>Lucky you! Almost any style works with an oval face. Try layered cuts, bobs, or long flowing locks.</p>

      <h2>Round Face Shape</h2>
      <p>Create length with layered cuts, long bobs, and styles with volume at the crown. Avoid blunt bangs.</p>

      <h2>Square Face Shape</h2>
      <p>Soften angles with soft waves, side-swept bangs, and long layers. Avoid blunt, straight cuts.</p>

      <h2>Heart Face Shape</h2>
      <p>Balance a wider forehead with chin-length bobs, side parts, and soft, face-framing layers.</p>

      <h2>Long Face Shape</h2>
      <p>Add width with blunt bangs, shoulder-length cuts, and horizontal layers. Avoid too much length.</p>

      <p><strong>Pro Tip:</strong> Bring reference photos to your stylist and discuss what will work best for your lifestyle!</p>
    `
  }
];

export default function BlogDetailPage() {
  const params = useParams();
  const post = BLOG_POSTS.find(p => p.id === params.id);

  if (!post) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "200px 40px", textAlign: "center" }}>
          <h1>Blog post not found</h1>
          <Link href={ROUTES.BLOGS}>Back to Blogs</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        
        {/* Hero Image */}
        <section style={{ 
          position: "relative",
          height: "60vh",
          overflow: "hidden"
        }}>
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(13,12,10,0.8) 0%, transparent 50%)"
          }} />

          {/* Back Button - Positioned on Image */}
          <div style={{
            position: "absolute",
            bottom: 30,
            left: 40
          }}>
            <Link
              href={ROUTES.BLOGS}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: "0.9rem",
                fontWeight: 700,
                background: "rgba(13,12,10,0.9)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,151,59,0.95)";
                e.currentTarget.style.color = "#0d0c0a";
                e.currentTarget.style.gap = "12px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(13,12,10,0.9)";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.gap = "8px";
              }}
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
              Back to Blogs
            </Link>
          </div>
        </section>

        {/* Article Content */}
        <article style={{
          background: "var(--bg-primary)",
          padding: "60px 0 100px"
        }}>
          <div className="sal-container" style={{ maxWidth: 1300, paddingLeft: 40, paddingRight: 40 }}>
            
            {/* Category Badge - Moved Here */}
            <div style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "rgba(201,151,59,0.15)",
              border: "1px solid rgba(201,151,59,0.3)",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--gold)",
              marginBottom: 20
            }}>
              {post.category}
            </div>
            
            {/* Title */}
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 24,
              color: "var(--text-primary)"
            }}>
              {post.title}
            </h1>

            {/* Meta Info */}
            <div style={{
              display: "flex",
              gap: 24,
              marginBottom: 40,
              paddingBottom: 40,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(201,151,59,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <User style={{ width: 18, height: 18, color: "var(--gold)" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Written by</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{post.author}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  <Calendar style={{ width: 16, height: 16 }} />
                  {post.date}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  <Clock style={{ width: 16, height: 16 }} />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Content */}
            <div 
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--text-secondary)"
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="blog-content"
            />

            {/* CTA Box */}
            <div style={{
              marginTop: 60,
              padding: "40px",
              background: "var(--bg-secondary)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.05)",
              textAlign: "center"
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                marginBottom: 12,
                color: "var(--text-primary)"
              }}>
                Ready to Try These Tips?
              </h3>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                marginBottom: 24
              }}>
                Book an appointment with our expert stylists today
              </p>
              <Link
                href={ROUTES.BOOK}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 32px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #C9973B 0%, #B8842A 100%)",
                  color: "#0d0c0a",
                  borderRadius: 12,
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(201,151,59,0.35)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,151,59,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,151,59,0.35)";
                }}
              >
                <Calendar style={{ width: 18, height: 18 }} />
                Book Appointment
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />

      <style jsx global>{`
        .blog-content h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 40px;
          margin-bottom: 16px;
        }
        .blog-content p {
          margin-bottom: 20px;
        }
        .blog-content strong {
          color: var(--gold);
          font-weight: 700;
        }
      `}</style>
    </>
  );
}
