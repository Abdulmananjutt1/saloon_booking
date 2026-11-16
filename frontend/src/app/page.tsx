import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import {
  HomeHero,
  GoldTicker,
  AboutSection,
  ServicesPreviewSection,
  LuxuryBrandsSection,
  GalleryPreviewSection,
} from "@/components/home";
import { SERVICES, REVIEWS } from "@/lib/data/salon";

export default function HomePage() {
  const popularServices = SERVICES.filter((s) => s.popular).slice(0, 6);

  return (
    <>
      <ScrollReveal />
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <HomeHero />
        <GoldTicker />
        <AboutSection />
        <ServicesPreviewSection services={popularServices} />
        <LuxuryBrandsSection />
        <GalleryPreviewSection />
        <div id="reviews">
          <TestimonialsSection reviews={REVIEWS} animated />
        </div>
      </main>
      <Footer />
    </>
  );
}
