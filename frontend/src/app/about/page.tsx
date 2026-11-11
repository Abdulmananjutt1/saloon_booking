"use client";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, Phone, Mail, MapPin, Calendar, Heart, Shield, 
  Globe, Target, Coffee, Sparkles, Users, TrendingUp, 
  CheckCircle, Star, Clock, Scissors, Crown, Zap, Smile,
  Leaf, Diamond
} from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES, STATS, APP_PHONE, APP_EMAIL, APP_ADDRESS } from "@/constants";
import { REVIEWS, STYLISTS } from "@/lib/data/salon";
import { fetchStylists } from "@/lib/api/stylists";

// export const metadata: Metadata = {
//   title: "About Us — Glamour Studio | Islamabad's Premier Salon",
//   description:
//     "Discover the story behind Islamabad's premier salon — expert stylists, luxury products, and a commitment to excellence since 2015. Experience beauty redefined.",
// };

const MILESTONES = [
  { year: "2015", title: "Founded", description: "Started with a vision to redefine beauty standards" },
  { year: "2018", title: "Expansion", description: "Opened our flagship location in F-7" },
  { year: "2021", title: "Award Winning", description: "Best Salon Award by Beauty Pakistan" },
  { year: "2024", title: "15K+ Clients", description: "Serving thousands of happy clients annually" },
];

const ACHIEVEMENTS = [
  { icon: Award, number: "50+", label: "Services Offered", color: "var(--gold)" },
  { icon: Users, number: "15+", label: "Expert Stylists", color: "var(--gold-light)" },
  { icon: Star, number: "4.9/5", label: "Client Rating", color: "var(--gold)" },
  { icon: TrendingUp, number: "15K+", label: "Happy Clients", color: "var(--gold-light)" },
];

const WHY_CHOOSE_US = [
  { 
    icon: Crown, 
    title: "Luxury Experience", 
    description: "Step into an oasis of elegance where every detail speaks luxury — from our plush interiors to our premium product selection.",
    color: "var(--gold)",
    gradient: "linear-gradient(135deg, #C9973B 0%, #D4AF6A 100%)"
  },
  { 
    icon: Scissors, 
    title: "Master Craftsmanship", 
    description: "Our stylists are artists trained in the latest international techniques, bringing precision and creativity to every service.",
    color: "var(--gold-light)",
    gradient: "linear-gradient(135deg, #D4AF6A 0%, #E8D4A8 100%)"
  },
  { 
    icon: Heart, 
    title: "Personalized Care", 
    description: "No two clients are alike. We take time to understand your style, preferences, and lifestyle to create your perfect look.",
    color: "#FF6B9D",
    gradient: "linear-gradient(135deg, #FF6B9D 0%, #FFA5C7 100%)"
  },
  { 
    icon: Shield, 
    title: "Premium Products", 
    description: "We exclusively use certified, top-tier brands — L'Oréal, Wella, Kérastase — ensuring salon-quality results that last.",
    color: "#6B7AFF",
    gradient: "linear-gradient(135deg, #6B7AFF 0%, #A5B0FF 100%)"
  },
  { 
    icon: Sparkles, 
    title: "Hygienic Standards", 
    description: "Your safety is paramount. We maintain the highest standards of cleanliness, sterilization, and COVID-safe protocols.",
    color: "#00D4AA",
    gradient: "linear-gradient(135deg, #00D4AA 0%, #5FFFDA 100%)"
  },
  { 
    icon: Smile, 
    title: "Relaxing Ambiance", 
    description: "Enjoy complimentary refreshments, soothing music, and a stress-free environment designed for your complete relaxation.",
    color: "#FFB86B",
    gradient: "linear-gradient(135deg, #FFB86B 0%, #FFD4A5 100%)"
  },
];

const VALUES = [
  { icon: Heart, title: "Personalized Care", description: "Every service is tailored to your unique needs, face shape, and personal style. We listen first, then create.", color: "var(--gold)" },
  { icon: Shield, title: "Premium Products", description: "We use only certified, top-tier products — Loreal, Wella, Kerastase — for results that last and shine.", color: "var(--gold-light)" },
  { icon: Award, title: "Expert Certification", description: "All stylists undergo rigorous training and international certification to ensure cutting-edge techniques.", color: "var(--gold)" },
  { icon: Globe, title: "Clean & Safe", description: "Our salon maintains the highest standards of hygiene, sterilization, and COVID-safe protocols.", color: "var(--gold-light)" },
  { icon: Target, title: "Precision Focus", description: "From a subtle trim to dramatic transformation, every detail is executed with meticulous attention.", color: "var(--gold)" },
  { icon: Coffee, title: "Relaxing Experience", description: "Enjoy complimentary refreshments, soothing music, and a stress-free environment from start to finish.", color: "var(--gold-light)" },
];

// Animation Hook
function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return visibleElements;
}

export default function AboutPage() {
  const [apiStylists, setApiStylists] = useState(STYLISTS);
  const [mounted, setMounted] = useState(false);
  const visibleElements = useScrollAnimation();

  useEffect(() => {
    setMounted(true);
    fetchStylists().then((data) => {
      if (data.length > 0) setApiStylists(data);
    });
  }, []);

  const featuredStylists = apiStylists.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        
        {/* Hero Section - Balanced */}
        <section style={{ 
          position: "relative", 
          minHeight: "70vh", 
          display: "flex", 
          alignItems: "center", 
          overflow: "hidden"
        }}>
          {/* About Us Background Image - Professional Salon Interior */}
          <div style={{ 
            position: "absolute", 
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat"
          }} />
          
          {/* Subtle overlay for better text contrast */}
          <div style={{ 
            position: "absolute", 
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(251,246,240,0.25) 100%)"
          }} />
          
          <div className="sal-container" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "90px 40px 80px", maxWidth: 1440 }}>
            <div 
              data-animate="fade-up" 
              id="hero-content"
              style={{ 
                opacity: visibleElements.has("hero-content") ? 1 : 0,
                transform: visibleElements.has("hero-content") ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <div style={{ 
                display: "inline-block", 
                padding: "8px 20px", 
                background: "rgba(201,151,59,0.15)", 
                border: "1px solid rgba(201,151,59,0.4)",
                borderRadius: 50,
                marginBottom: 24,
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#8B6914",
                boxShadow: "0 2px 8px rgba(201,151,59,0.15)"
              }}>
                ✨ Since 2015 · Islamabad's Premier Destination
              </div>
              
              <h1 style={{ 
                fontSize: "clamp(2.5rem, 6vw, 4.2rem)", 
                fontWeight: 900, 
                lineHeight: 1.15,
                marginBottom: 22,
                color: "#1a1816",
                letterSpacing: "-0.02em"
              }}>
                Where Beauty Meets
                <br />
                <span style={{ 
                  background: "linear-gradient(135deg, #C9973B 0%, #8B6914 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>Excellence</span>
              </h1>
              
              <p style={{ 
                fontSize: "1.1rem", 
                color: "#4a4239", 
                maxWidth: 660, 
                margin: "0 auto 38px",
                lineHeight: 1.7,
                fontWeight: 500
              }}>
                Transform yourself at Islamabad's most trusted salon. Experience luxury, precision, and personalized care that brings out your natural beauty.
              </p>

              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Link 
                  href={ROUTES.BOOK} 
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "16px 32px", 
                    fontSize: "1rem",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #C9973B 0%, #B8842A 100%)",
                    color: "#0d0c0a",
                    borderRadius: 12,
                    textDecoration: "none",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(201,151,59,0.35)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
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
                <Link 
                  href={ROUTES.SERVICES}
                  style={{ 
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "16px 32px", 
                    fontSize: "1rem",
                    fontWeight: 700,
                    background: "transparent",
                    color: "#1a1816",
                    borderRadius: 12,
                    textDecoration: "none",
                    border: "2px solid #1a1816",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1a1816";
                    e.currentTarget.style.color = "#fbf6f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#1a1816";
                  }}
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section - Enhanced */}
        <section style={{ background: "var(--bg-secondary)", padding: "120px 0", overflow: "hidden", position: "relative" }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div className="sal-grid-2col" style={{ gap: 80, alignItems: "center" }}>
              <div 
                data-animate="fade-right" 
                id="story-content"
                style={{ 
                  opacity: visibleElements.has("story-content") ? 1 : 0,
                  transform: visibleElements.has("story-content") ? "translateX(0)" : "translateX(-30px)",
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s"
                }}
              >
                <span className="sal-eyebrow" style={{ color: "var(--gold)" }}>
                  <Diamond style={{ width: 16, height: 16, display: "inline", marginRight: 8 }} />
                  Our Journey
                </span>
                <h2 className="sal-h2" style={{ marginBottom: 20, lineHeight: 1.15 }}>
                  From a Small Dream
                  <br />
                  <span className="text-gold">To Premier Destination</span>
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.9, marginBottom: 20 }}>
                  What began as a passion project in 2015 has blossomed into Islamabad&apos;s most sought-after beauty haven. Founded by master stylist <strong style={{ color: "var(--gold)" }}>Ayesha Khan</strong>, our vision was crystal clear: create a sanctuary where artistry, luxury, and genuine care converge.
                </p>
                <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.9, marginBottom: 32 }}>
                  Today, we&apos;re a powerhouse of 15+ certified specialists delivering 50+ transformative services. Yet our heart remains the same — making every client feel truly seen, heard, and beautifully transformed.
                </p>

                {/* Timeline Mini */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 32 }}>
                  {[
                    { year: "2015", label: "Founded with Vision" },
                    { year: "2018", label: "Flagship Expansion" },
                    { year: "2021", label: "Award Recognition" },
                    { year: "2024", label: "15K+ Happy Clients" }
                  ].map((milestone, i) => (
                    <div key={i} style={{ 
                      padding: 16, 
                      background: "rgba(201,151,59,0.05)", 
                      border: "1px solid rgba(201,151,59,0.15)",
                      borderRadius: 12
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--gold)", marginBottom: 4 }}>
                        {milestone.year}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        {milestone.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Founder Card */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 20, 
                  padding: 24, 
                  background: "linear-gradient(135deg, rgba(201,151,59,0.08) 0%, rgba(201,151,59,0.03) 100%)", 
                  borderRadius: 16, 
                  border: "1px solid rgba(201,151,59,0.2)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: "radial-gradient(circle, rgba(201,151,59,0.2) 0%, transparent 70%)",
                    borderRadius: "50%",
                    filter: "blur(30px)"
                  }} />
                  <div style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: "50%", 
                    background: "var(--grad-gold-btn)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontWeight: 900, 
                    color: "#0d0c0a", 
                    fontSize: "1.4rem",
                    boxShadow: "0 8px 24px rgba(201,151,59,0.3)"
                  }}>
                    AK
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.1rem", marginBottom: 4 }}>
                      Ayesha Khan
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--gold)", fontWeight: 600 }}>
                      Founder & Master Stylist
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6 }}>
                      20+ Years of International Experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Section with Floating Cards */}
              <div 
                data-animate="fade-left" 
                id="story-image"
                style={{ 
                  position: "relative",
                  opacity: visibleElements.has("story-image") ? 1 : 0,
                  transform: visibleElements.has("story-image") ? "translateX(0)" : "translateX(30px)",
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s"
                }}
              >
                <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 550, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
                  <Image
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                    alt="Glamour Studio Interior"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,9,7,0.6) 0%, transparent 50%)" }} />
                </div>

                {/* Floating Award Card */}
                <div style={{ 
                  position: "absolute", 
                  bottom: 30, 
                  left: -30, 
                  padding: "20px 24px", 
                  borderRadius: 20, 
                  background: "rgba(13,12,10,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(201,151,59,0.3)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ 
                      width: 52, 
                      height: 52, 
                      borderRadius: 14, 
                      background: "var(--grad-gold-btn)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <Award style={{ width: 26, height: 26, color: "#0d0c0a" }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, color: "var(--gold)", fontSize: "1rem" }}>
                        Best Salon 2024
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        Beauty Pakistan Award
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Card */}
                <div style={{ 
                  position: "absolute", 
                  top: 30, 
                  right: -20, 
                  padding: "16px 20px", 
                  borderRadius: 16, 
                  background: "rgba(13,12,10,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(201,151,59,0.3)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  minWidth: 140
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold)", marginBottom: 4 }}>
                      15K+
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Transformations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Compact Design */}
        <section style={{ background: "var(--bg-primary)", padding: "80px 0", position: "relative", overflow: "hidden" }}>
          <div className="sal-container" style={{ position: "relative", maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div 
              data-animate="fade-up" 
              id="why-header"
              style={{ 
                textAlign: "center", 
                marginBottom: 50,
                opacity: visibleElements.has("why-header") ? 1 : 0,
                transform: visibleElements.has("why-header") ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <span className="sal-eyebrow" style={{ color: "var(--gold)" }}>
                <Sparkles style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
                Why Choose Us
              </span>
              <h2 className="sal-h2" style={{ marginBottom: 12, fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                What Makes Us <span className="text-gold">Different</span>
              </h2>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: 24 
            }}>
              {WHY_CHOOSE_US.map((item, i) => (
                <div 
                  key={i}
                  data-animate="fade-up" 
                  id={`why-card-${i}`}
                  style={{ 
                    padding: 28, 
                    background: "var(--bg-secondary)", 
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.05)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: visibleElements.has(`why-card-${i}`) ? 1 : 0,
                    transform: visibleElements.has(`why-card-${i}`) ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: `${i * 0.08}s`,
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.25)";
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  }}
                >
                  {/* Top Gradient Bar */}
                  <div style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: 3, 
                    background: item.gradient 
                  }} />

                  {/* Icon */}
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 14, 
                    background: `${item.color}12`, 
                    border: `1px solid ${item.color}25`,
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    marginBottom: 18
                  }}>
                    <item.icon style={{ width: 26, height: 26, color: item.color }} />
                  </div>

                  {/* Content */}
                  <h3 style={{ 
                    fontWeight: 700, 
                    color: "var(--text-primary)", 
                    fontSize: "1.05rem", 
                    marginBottom: 10,
                    letterSpacing: "-0.01em"
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ 
                    fontSize: "0.88rem", 
                    color: "var(--text-secondary)", 
                    lineHeight: 1.65,
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section - New */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div 
              data-animate="fade-up" 
              id="achievements-grid"
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: 40,
                opacity: visibleElements.has("achievements-grid") ? 1 : 0,
                transform: visibleElements.has("achievements-grid") ? "scale(1)" : "scale(0.95)",
                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {ACHIEVEMENTS.map((achievement, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    background: "var(--bg-primary)",
                    border: "2px solid rgba(201,151,59,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    <div style={{ 
                      position: "absolute",
                      inset: -20,
                      background: "radial-gradient(circle, rgba(201,151,59,0.15) 0%, transparent 70%)",
                      filter: "blur(20px)"
                    }} />
                    <achievement.icon style={{ width: 36, height: 36, color: achievement.color, position: "relative" }} />
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--gold)", marginBottom: 8 }}>
                    {achievement.number}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 48,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <span className="sal-eyebrow">Meet Our Experts</span>
                <h2 className="sal-h2" style={{ marginTop: 8 }}>
                  Our Talented <span className="text-gold">Master Stylists</span>
                </h2>
              </div>
            </div>

            <div className="sal-grid" style={{ gap: 24 }}>
              {featuredStylists.map((stylist) => (
                <div key={stylist.id} className="sal-card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 320, background: "var(--bg-secondary)" }}>
                    {stylist.image && (
                      <img
                        src={stylist.image}
                        alt={stylist.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-primary)" }}>
                      {stylist.name}
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--gold)", marginBottom: 8 }}>
                      {stylist.specialty}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {stylist.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span className="sal-eyebrow">Client Stories</span>
              <h2 className="sal-h2" style={{ marginTop: 8 }}>
                What Our Clients <span className="text-gold">Say About Us</span>
              </h2>
            </div>

            <div className="sal-grid" style={{ gap: 20 }}>
              {REVIEWS.slice(0, 6).map((review) => (
                <div key={review.id} className="sal-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: 16,
                          height: 16,
                          fill: i < review.rating ? "var(--gold)" : "none",
                          stroke: i < review.rating ? "var(--gold)" : "var(--text-muted)",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                    "{review.text}"
                  </p>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      {review.name}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {review.service}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
