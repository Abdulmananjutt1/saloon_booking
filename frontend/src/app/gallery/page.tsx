"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, ArrowRight, Scissors, Sparkles, Camera, 
  Heart, Star, Crown, User, Palette, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GALLERY_IMAGES } from "@/lib/data/salon";
import { ROUTES } from "@/constants";

// export const metadata: Metadata = {
//   title: "Gallery — Glamour Studio",
//   description: "Browse our portfolio of haircuts, colors, facials, bridal, and nail art.",
// };

const EXTRA = [
  { id: "g10", src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", category: "bridal" as const, caption: "Elegant Bridal Look" },
  { id: "g11", src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", category: "beard" as const, caption: "Classic Fade" },
  { id: "g12", src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", category: "facial" as const, caption: "Radiant Skin" },
  { id: "g13", src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", category: "facial" as const, caption: "Spa Glow" },
  { id: "g14", src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", category: "nails" as const, caption: "Gel Nail Art" },
  { id: "g15", src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: "haircut" as const, caption: "Silk Finish" },
  { id: "g16", src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", category: "haircut" as const, caption: "Layered Perfection" },
  { id: "g17", src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80", category: "color" as const, caption: "Balayage Beauty" },
  { id: "g18", src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80", category: "bridal" as const, caption: "Dreamy Bridal" },
];

const ALL_IMAGES = [...GALLERY_IMAGES, ...EXTRA];

const CATEGORIES = [
  { label: "All Work", value: "all", icon: Sparkles, color: "#C9973B" },
  { label: "Haircuts", value: "haircut", icon: Scissors, color: "#FF6B9D" },
  { label: "Beard Styling", value: "beard", icon: User, color: "#6B7AFF" },
  { label: "Hair Color", value: "color", icon: Palette, color: "#00D4AA" },
  { label: "Facials", value: "facial", icon: Heart, color: "#FFB86B" },
  { label: "Nail Art", value: "nails", icon: Star, color: "#9D6BFF" },
  { label: "Bridal", value: "bridal", icon: Crown, color: "#FF5757" },
];

const STATS = [
  { value: "15K+", label: "Transformations", icon: Star },
  { value: "50+", label: "Services", icon: Scissors },
  { value: "4.9", label: "Rating", icon: Heart },
  { value: "12", label: "Years Experience", icon: Crown },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredImages = activeCategory === "all" 
    ? ALL_IMAGES 
    : ALL_IMAGES.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxIndex]);

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        
        {/* Hero Section */}
        <section style={{ 
          position: "relative", 
          minHeight: "75vh", 
          display: "flex", 
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0a0908 0%, #1a1816 100%)"
        }}>
          {/* Background Pattern */}
          <div style={{ 
            position: "absolute", 
            inset: 0,
            backgroundImage: `url("https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            filter: "blur(2px)"
          }} />

          {/* Gradient Overlay */}
          <div style={{ 
            position: "absolute", 
            inset: 0,
            background: "linear-gradient(135deg, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.7) 100%)"
          }} />

          {/* Content */}
          <div className="sal-container" style={{ 
            position: "relative", 
            zIndex: 2, 
            textAlign: "center",
            maxWidth: 1440,
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 100,
            paddingBottom: 100
          }}>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: 10,
              padding: "10px 24px", 
              background: "rgba(201,151,59,0.15)", 
              border: "1px solid rgba(201,151,59,0.4)",
              borderRadius: 50,
              marginBottom: 28,
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--gold)",
              backdropFilter: "blur(10px)"
            }}>
              <Camera style={{ width: 16, height: 16 }} />
              OUR PORTFOLIO
            </div>

            <h1 style={{ 
              fontSize: "clamp(2.5rem, 7vw, 5rem)", 
              fontWeight: 900, 
              lineHeight: 1.15,
              marginBottom: 24,
              color: "#ffffff",
              letterSpacing: "-0.02em"
            }}>
              Where Art Meets
              <br />
              <span style={{ color: "var(--gold)" }}>Beauty</span>
            </h1>

            <p style={{ 
              fontSize: "1.1rem", 
              color: "rgba(255,255,255,0.75)", 
              maxWidth: 650, 
              margin: "0 auto 40px",
              lineHeight: 1.7
            }}>
              Every photograph captures a moment of transformation. Browse through our curated collection of {ALL_IMAGES.length}+ stunning makeovers.
            </p>

            {/* Stats Row */}
            <div style={{ 
              display: "flex",
              gap: 40,
              justifyContent: "center",
              flexWrap: "wrap",
              margin: "0 auto 48px",
              maxWidth: 800
            }}>
              {STATS.map((stat, i) => (
                <div key={i} style={{ textAlign: "center", minWidth: 100 }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    margin: "0 auto 12px",
                    borderRadius: "50%",
                    background: "rgba(201,151,59,0.1)",
                    border: "2px solid rgba(201,151,59,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <stat.icon style={{ width: 24, height: 24, color: "var(--gold)" }} />
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--gold)", marginBottom: 6 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a 
                href="#gallery"
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
                  boxShadow: "0 4px 20px rgba(201,151,59,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  border: "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,151,59,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,151,59,0.3)";
                }}
              >
                <Sparkles style={{ width: 18, height: 18 }} />
                Explore Gallery
              </a>
              <Link 
                href={ROUTES.BOOK}
                style={{ 
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 32px", 
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "transparent",
                  color: "#ffffff",
                  borderRadius: 12,
                  textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
              >
                <Calendar style={{ width: 18, height: 18 }} />
                Book Now
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            
            {/* Category Filter Pills */}
            <div style={{ 
              display: "flex", 
              gap: 12, 
              justifyContent: "center", 
              flexWrap: "wrap",
              marginBottom: 60
            }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 28px",
                    borderRadius: 16,
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                    ...(activeCategory === cat.value
                      ? {
                          background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                          color: "#ffffff",
                          boxShadow: `0 8px 24px ${cat.color}40`,
                          transform: "translateY(-2px)"
                        }
                      : {
                          background: "var(--bg-primary)",
                          color: "var(--text-secondary)",
                          border: "1.5px solid rgba(255,255,255,0.1)"
                        }
                    )
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat.value) {
                      e.currentTarget.style.borderColor = cat.color;
                      e.currentTarget.style.color = cat.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat.value) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <cat.icon style={{ width: 16, height: 16 }} />
                  {cat.label}
                  {activeCategory === cat.value && (
                    <span style={{ 
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#ffffff",
                      marginLeft: 4
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* Gallery Grid - Masonry Style */}
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
              marginBottom: 60
            }}>
              {filteredImages.map((img, i) => {
                const isLarge = i % 7 === 0;
                return (
                  <div
                    key={`${img.id}-${i}`}
                    onClick={() => openLightbox(i)}
                    style={{
                      position: "relative",
                      borderRadius: 20,
                      overflow: "hidden",
                      cursor: "pointer",
                      gridRow: isLarge ? "span 2" : "span 1",
                      height: isLarge ? 620 : 300,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? "translateY(0)" : "translateY(20px)",
                      transitionDelay: `${i * 0.05}s`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4)";
                      e.currentTarget.style.zIndex = "10";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.zIndex = "1";
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.caption || `Gallery ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Overlay */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,9,8,0.9) 0%, transparent 60%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: 24,
                      opacity: 0,
                      transition: "opacity 0.3s ease"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
                    >
                      <div style={{
                        display: "inline-block",
                        alignSelf: "flex-start",
                        padding: "6px 14px",
                        background: "rgba(201,151,59,0.9)",
                        borderRadius: 8,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#0a0908",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 10
                      }}>
                        {img.category}
                      </div>
                      {img.caption && (
                        <p style={{
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: isLarge ? "1.2rem" : "1rem",
                          margin: 0,
                          letterSpacing: "-0.01em"
                        }}>
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div style={{ 
              textAlign: "center",
              padding: "60px 40px",
              background: "var(--bg-primary)",
              borderRadius: 24,
              border: "1px solid rgba(201,151,59,0.2)"
            }}>
              <Sparkles style={{ width: 40, height: 40, color: "var(--gold)", margin: "0 auto 20px" }} />
              <h3 style={{ 
                fontSize: "2rem", 
                fontWeight: 800, 
                color: "var(--text-primary)", 
                marginBottom: 16 
              }}>
                Ready for Your <span style={{ color: "var(--gold)" }}>Transformation?</span>
              </h3>
              <p style={{ 
                fontSize: "1rem", 
                color: "var(--text-secondary)", 
                maxWidth: 600,
                margin: "0 auto 32px",
                lineHeight: 1.7
              }}>
                Join 15,000+ satisfied clients who trusted us with their beauty journey. Book your appointment today and let's create magic together.
              </p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Link 
                  href={ROUTES.BOOK}
                  className="sal-btn sal-btn-gold"
                  style={{ padding: "16px 36px", fontSize: "1rem" }}
                >
                  <Calendar style={{ width: 18, height: 18 }} />
                  Book Appointment
                </Link>
                <Link 
                  href={ROUTES.SERVICES}
                  className="sal-btn sal-btn-outline"
                  style={{ padding: "16px 36px", fontSize: "1rem" }}
                >
                  View Services
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div 
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              animation: "fadeIn 0.3s ease"
            }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              style={{
                position: "absolute",
                top: 30,
                right: 30,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,151,59,0.9)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <X style={{ width: 24, height: 24 }} />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{
                position: "absolute",
                left: 30,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,151,59,0.9)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <ChevronLeft style={{ width: 28, height: 28 }} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{
                position: "absolute",
                right: 30,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                zIndex: 10001
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,151,59,0.9)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <ChevronRight style={{ width: 28, height: 28 }} />
            </button>

            {/* Image */}
            <div 
              style={{ 
                position: "relative", 
                maxWidth: "90vw", 
                maxHeight: "85vh",
                width: "auto",
                height: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].caption || "Gallery"}
                style={{
                  maxWidth: "100%",
                  maxHeight: "85vh",
                  borderRadius: 16,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.8)"
                }}
              />
              
              {/* Caption */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 24,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
              }}>
                <div style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "var(--gold)",
                  borderRadius: 6,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#0a0908",
                  textTransform: "uppercase",
                  marginBottom: 8
                }}>
                  {filteredImages[lightboxIndex].category}
                </div>
                {filteredImages[lightboxIndex].caption && (
                  <p style={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    margin: 0
                  }}>
                    {filteredImages[lightboxIndex].caption}
                  </p>
                )}
                <p style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.85rem",
                  margin: "8px 0 0 0"
                }}>
                  {lightboxIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
