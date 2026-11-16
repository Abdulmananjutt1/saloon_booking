import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import { GALLERY_PREVIEW_IMAGES } from "@/lib/data/home";

const tabs = ["All Photos", "Hair Care", "Skincare", "Nails", "Makeup"];
export default function GalleryPreviewSection() {
  const images = [...GALLERY_PREVIEW_IMAGES, "/assets/hero-woman.jpg"];
  return <section className="beauty-gallery" id="gallery"><div className="beauty-gallery-inner"><div className="beauty-gallery-heading"><div className="beauty-gallery-kicker"><span /><Sparkles size={18} /> Gallery <span /></div><h2>Explore Our <em>Gallery</em></h2><p>A glimpse of our premium beauty services, stunning transformations<br className="desktop-only" /> and the luxurious experience we provide.</p></div><div className="beauty-gallery-tabs">{tabs.map((tab, i) => <button key={tab} className={i === 0 ? "is-active" : ""} type="button">{tab}</button>)}</div><div className="beauty-gallery-grid">{images.map((src, i) => <div key={src} className={`beauty-gallery-item beauty-gallery-item-${i + 1}`}><Image src={src} alt={`Gallery beauty look ${i + 1}`} fill sizes="(max-width: 700px) 100vw, 25vw" /><span className="beauty-gallery-zoom"><Search size={18} /></span></div>)}</div></div></section>;
}

