"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, Star, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/services/ServiceCard";
import { ROUTES } from "@/constants";
import { SERVICES } from "@/lib/data/salon";
import type { ServiceCategory } from "@/types";

// export const metadata: Metadata = {
//   title: "Services — Glamour Studio",
//   description: "Browse all salon services — haircut, beard, color, facial, massage & more.",
// };

const SERVICE_CATEGORIES = [
  { value: "all", label: "All Services", icon: "✨", color: "#C9973B" },
  { value: "haircut", label: "Hair Services", icon: "✂️", color: "#FF6B9D" },
  { value: "color", label: "Color & Highlights", icon: "🎨", color: "#6B7AFF" },
  { value: "facial", label: "Facials & Skincare", icon: "💆", color: "#00D4AA" },
  { value: "bridal", label: "Bridal Packages", icon: "👰", color: "#FFD700" },
  { value: "massage", label: "Spa & Massage", icon: "💆‍♀️", color: "#9D6BFF" },
  { value: "nails", label: "Nail Art", icon: "💅", color: "#FF9D6B" },
];

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default function ServicesPage({ searchParams }: Props) {
  const [params, setParams] = useState<{ cat?: string }>({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    searchParams.then((p) => {
      setParams(p);
      setActiveCategory(p.cat || "all");
    });
    setMounted(true);
  }, [searchParams]);

  const filtered = activeCategory === "all"
    ? SERVICES
    : SERVICES.filter((s) => s.category === (activeCategory as ServiceCategory));

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        
        {/* Clean Hero Section with Background Image */}
        <section style={{ 
          position: "relative",
          padding: "120px 0 80px",
          overflow: "hidden"
        }}>
          {/* Background Image */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }} />

          {/* Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(251,246,240,0.60) 100%)"
          }} />

          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40, position: "relative", zIndex: 2 }}>
            <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
              <div style={{
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(201,151,59,0.15)",
                border: "1px solid rgba(201,151,59,0.3)",
                borderRadius: 50,
                marginBottom: 24,
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#8B6914",
                boxShadow: "0 2px 8px rgba(201,151,59,0.15)"
              }}>
                Premium Beauty Services
              </div>

              <h1 style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: 20,
                color: "#1a1816"
              }}>
                Our Services
              </h1>

              <p style={{
                fontSize: "1.1rem",
                color: "#4a4239",
                lineHeight: 1.7,
                marginBottom: 40,
                fontWeight: 500
              }}>
                Professional beauty and grooming services crafted to perfection by our expert stylists
              </p>

              <div style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                <a
                  href="#services"
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
                    boxShadow: "0 4px 16px rgba(201,151,59,0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,151,59,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(201,151,59,0.3)";
                  }}
                >
                  Explore Services
                </a>
                <Link
                  href={ROUTES.BOOK}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 32px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    background: "transparent",
                    color: "#1a1816",
                    borderRadius: 12,
                    textDecoration: "none",
                    border: "2px solid #1a1816",
                    transition: "all 0.3s ease"
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
                  <Calendar style={{ width: 17, height: 17 }} />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills */}
        <section id="services" style={{
          background: "var(--bg-primary)",
          padding: "50px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    padding: "12px 24px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: activeCategory === cat.value 
                      ? "linear-gradient(135deg, #C9973B 0%, #B8842A 100%)" 
                      : "var(--bg-secondary)",
                    color: activeCategory === cat.value ? "#0d0c0a" : "var(--text-secondary)",
                    border: "1px solid " + (activeCategory === cat.value ? "transparent" : "rgba(255,255,255,0.08)"),
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: activeCategory === cat.value ? "0 4px 12px rgba(201,151,59,0.3)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat.value) {
                      e.currentTarget.style.background = "rgba(201,151,59,0.08)";
                      e.currentTarget.style.borderColor = "rgba(201,151,59,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat.value) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{
              textAlign: "center",
              marginTop: 30,
              fontSize: "0.9rem",
              color: "var(--text-muted)"
            }}>
              Showing <strong style={{ color: "var(--gold)" }}>{filtered.length}</strong> services
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{
          background: "var(--bg-primary)",
          padding: "80px 0 100px"
        }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div className="sal-grid" style={{ gap: 24 }}>
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} className="sal-card" />
              ))}
            </div>

            {/* Bottom CTA */}
            <div style={{
              marginTop: 80,
              padding: "60px 40px",
              background: "var(--bg-secondary)",
              borderRadius: 20,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <h3 style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                marginBottom: 16,
                color: "var(--text-primary)"
              }}>
                Ready to Transform Your Look?
              </h3>
              <p style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                marginBottom: 32,
                maxWidth: 600,
                margin: "0 auto 32px"
              }}>
                Book your appointment now and experience the difference with our expert team
              </p>
              <Link
                href={ROUTES.BOOK}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 36px",
                  fontSize: "1rem",
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
                Book Your Appointment
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
