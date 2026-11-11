import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Diamond, Leaf, Play, Star, Tag, Users } from "lucide-react";
import { ROUTES } from "@/constants";

const FEATURES = [
  { icon: Users, label: "Expert Stylists" },
  { icon: Diamond, label: "Premium Products" },
  { icon: Leaf, label: "Relaxing Atmosphere" },
  { icon: Tag, label: "Affordable Prices" },
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
];

export default function HomeHero() {
  return (
    <section className="lux-hero">
      <div className="lux-hero-bg" />
      <div className="lux-hero-glow lux-hero-glow-left" />
      <div className="lux-hero-glow lux-hero-glow-right" />

      <Image
        src="/assets/hero-roses.jpg"
        alt=""
        width={420}
        height={420}
        className="lux-hero-roses"
        priority
      />
      <Image
        src="/assets/hero-plants.jpg"
        alt=""
        width={380}
        height={520}
        className="lux-hero-plants"
        priority
      />

      <div className="sal-container lux-hero-inner">
        <div className="lux-hero-copy">
          <div className="lux-hero-badge">
            <Star style={{ width: 12, height: 12, fill: "currentColor" }} />
            Premium Beauty Salon
          </div>

          <h1 className="lux-hero-title">
            Enhance Your
            <br />
            Natural <em>Beauty</em>
          </h1>

          <p className="lux-hero-lead">
            Experience luxury salon services with expert stylists, premium care and a relaxing environment.
          </p>

          <div className="lux-hero-actions">
            <Link href={ROUTES.BOOK} className="lux-btn-dark">
              Book Appointment
              <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <a href="#story" className="lux-btn-story">
              <span className="lux-play">
                <Play style={{ width: 14, height: 14, fill: "currentColor" }} />
              </span>
              Watch Our Story
            </a>
          </div>

          <div className="lux-hero-features">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="lux-feature">
                <span className="lux-feature-icon">
                  <Icon style={{ width: 16, height: 16 }} />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lux-hero-visual">
          <div className="lux-oval">
            <Image
              src="/assets/hero-woman.jpg"
              alt="Glamour Studio client"
              fill
              className="lux-portrait"
              sizes="(max-width: 900px) 90vw, 520px"
              priority
            />
          </div>

          <div className="lux-rating-card">
            <div className="lux-rating-top">
              <span className="lux-rating-score">4.9</span>
              <div className="lux-avatars">
                {AVATARS.map((src) => (
                  <Image key={src} src={src} alt="" width={28} height={28} className="lux-avatar" />
                ))}
              </div>
            </div>
            <p className="lux-rating-label">+10k Happy Clients</p>
          </div>

          <p className="lux-script">
            Look Good
            <br />
            Feel Amazing
          </p>
        </div>
      </div>
    </section>
  );
}
