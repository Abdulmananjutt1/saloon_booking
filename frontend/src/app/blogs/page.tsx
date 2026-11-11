"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, User, Tag } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/constants";

const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Hair Care Tips for Healthy, Shiny Hair",
    excerpt: "Discover the secrets to maintaining gorgeous, healthy hair with these expert-approved tips from our professional stylists.",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
    category: "Hair Care",
    author: "Ayesha Khan",
    date: "Nov 10, 2024",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Bridal Makeup Trends for 2025",
    excerpt: "Stay ahead of the curve with the hottest bridal makeup trends that will make you look stunning on your special day.",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80",
    category: "Bridal",
    author: "Sara Ahmed",
    date: "Nov 8, 2024",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Skincare Routine for Glowing Skin",
    excerpt: "Learn the perfect skincare routine that will give you radiant, glowing skin all year round with our expert advice.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    category: "Skincare",
    author: "Maria Ali",
    date: "Nov 5, 2024",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Best Hair Colors for Different Skin Tones",
    excerpt: "Find the perfect hair color that complements your skin tone and enhances your natural beauty.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    category: "Hair Color",
    author: "Fatima Shah",
    date: "Nov 3, 2024",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Nail Art Ideas That Are Trending Now",
    excerpt: "Get inspired by the latest nail art trends and designs that are taking the beauty world by storm.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    category: "Nails",
    author: "Zara Khan",
    date: "Nov 1, 2024",
    readTime: "4 min read"
  },
  {
    id: 6,
    title: "How to Choose the Right Haircut for Your Face Shape",
    excerpt: "Discover which haircut styles work best for your unique face shape and personality.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    category: "Hair Care",
    author: "Ayesha Khan",
    date: "Oct 28, 2024",
    readTime: "6 min read"
  }
];

const CATEGORIES = ["All", "Hair Care", "Bridal", "Skincare", "Hair Color", "Nails"];

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        
        {/* Hero Section */}
        <section style={{ 
          position: "relative",
          padding: "100px 0 70px",
          overflow: "hidden",
          background: "var(--bg-secondary)"
        }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40, position: "relative", zIndex: 2 }}>
            <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
              <div style={{
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(201,151,59,0.1)",
                border: "1px solid rgba(201,151,59,0.2)",
                borderRadius: 50,
                marginBottom: 24,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--gold)"
              }}>
                Beauty & Lifestyle Tips
              </div>

              <h1 style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: 20,
                color: "var(--text-primary)"
              }}>
                Our <span style={{ color: "var(--gold)" }}>Blog</span>
              </h1>

              <p style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7
              }}>
                Expert tips, trends, and advice from our professional stylists to help you look and feel your best
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section style={{
          background: "var(--bg-primary)",
          padding: "40px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "10px 24px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    background: activeCategory === cat 
                      ? "linear-gradient(135deg, #C9973B 0%, #B8842A 100%)" 
                      : "var(--bg-secondary)",
                    color: activeCategory === cat ? "#0d0c0a" : "var(--text-secondary)",
                    border: "1px solid " + (activeCategory === cat ? "transparent" : "rgba(255,255,255,0.08)"),
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: activeCategory === cat ? "0 4px 12px rgba(201,151,59,0.3)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = "rgba(201,151,59,0.08)";
                      e.currentTarget.style.borderColor = "rgba(201,151,59,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = "var(--bg-secondary)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{
              textAlign: "center",
              marginTop: 24,
              fontSize: "0.9rem",
              color: "var(--text-muted)"
            }}>
              Showing <strong style={{ color: "var(--gold)" }}>{filteredPosts.length}</strong> articles
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section style={{
          background: "var(--bg-primary)",
          padding: "80px 0 100px"
        }}>
          <div className="sal-container" style={{ maxWidth: 1440, paddingLeft: 40, paddingRight: 40 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: 30
            }}>
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    background: "var(--bg-secondary)",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Image */}
                  <div style={{
                    position: "relative",
                    height: 240,
                    overflow: "hidden"
                  }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      padding: "6px 14px",
                      background: "rgba(201,151,59,0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#0d0c0a"
                    }}>
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 28 }}>
                    {/* Meta Info */}
                    <div style={{
                      display: "flex",
                      gap: 16,
                      marginBottom: 16,
                      fontSize: "0.8rem",
                      color: "var(--text-muted)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar style={{ width: 14, height: 14 }} />
                        {post.date}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock style={{ width: 14, height: 14 }} />
                        {post.readTime}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      marginBottom: 12,
                      lineHeight: 1.3
                    }}>
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      marginBottom: 20
                    }}>
                      {post.excerpt}
                    </p>

                    {/* Author & CTA */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 20,
                      borderTop: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10
                      }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(201,151,59,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <User style={{ width: 16, height: 16, color: "var(--gold)" }} />
                        </div>
                        <span style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "var(--text-secondary)"
                        }}>
                          {post.author}
                        </span>
                      </div>

                      <Link
                        href={`/blogs/${post.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          background: "transparent",
                          color: "var(--gold)",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textDecoration: "none"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.gap = "10px";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.gap = "6px";
                        }}
                      >
                        Read More
                        <ArrowRight style={{ width: 16, height: 16 }} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA Section */}
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
                Want to Experience These Tips Firsthand?
              </h3>
              <p style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                marginBottom: 32,
                maxWidth: 600,
                margin: "0 auto 32px"
              }}>
                Book an appointment with our expert stylists and get personalized advice for your beauty needs
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
