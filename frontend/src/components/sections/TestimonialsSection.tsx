"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gift, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Review } from "@/types";
import { ROUTES } from "@/constants";

interface TestimonialsSectionProps { reviews: Review[]; eyebrow?: string; animated?: boolean; }

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const review = reviews[active] ?? reviews[0];
  const total = reviews.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % total), 5000);
    return () => window.clearInterval(timer);
  }, [total]);

  const showNext = () => setActive((current) => (current + 1) % Math.max(total, 1));
  const showPrevious = () => setActive((current) => (current - 1 + Math.max(total, 1)) % Math.max(total, 1));

  return <section className="beauty-testimonials" id="reviews"><div className="beauty-testimonials-inner"><div className="beauty-testimonials-top"><div className="beauty-testimonial-side"><div className="beauty-testimonial-kicker"><Sparkles size={13} /> Testimonials</div><h2>What Our Clients Say</h2><p>Real stories. Real confidence.</p><div className="beauty-testimonial-card" key={review?.id}><div className="beauty-testimonial-avatar">{review?.customerName?.[0] ?? "A"}</div><div className="beauty-testimonial-content"><p>&quot;{review?.comment ?? "Absolutely amazing experience! The staff is so professional and the results are beyond expectations."}&quot;</p><b>— {review?.customerName ?? "Ayesha Khan"}</b></div><div className="beauty-testimonial-stars">{[1,2,3,4,5].map(i => <Star key={i} size={13} fill="currentColor" />)}</div></div><div className="beauty-testimonial-controls"><button type="button" onClick={showPrevious} aria-label="Previous testimonial"><ArrowLeft size={15} /></button><span>{total ? active + 1 : 0} / {total}</span><button type="button" onClick={showNext} aria-label="Next testimonial"><ArrowRight size={15} /></button></div></div><div className="beauty-offer-card"><div className="beauty-offer-copy"><div className="beauty-offer-kicker"><Gift size={14} /> Special Offers</div><h2>Beauty Deals<br />You&apos;ll Love</h2><p>Get up to 30% OFF on selected services this month.</p><Link href={ROUTES.BOOK} className="beauty-offer-btn">Grab the Offer <ArrowRight size={15} /></Link></div><div className="beauty-offer-image"><Image src="/assets/hero-woman.jpg" alt="Beauty offer" fill sizes="30vw" /></div><div className="beauty-offer-badge">30%<small>OFF</small></div></div></div><div className="beauty-testimonials-cta"><div><span>Ready to Look &amp; Feel Your Best?</span><small>Book your appointment today and step into a more beautiful you.</small></div><Link href={ROUTES.BOOK}>Book Appointment <ArrowRight size={16} /></Link></div></div></section>;
}
