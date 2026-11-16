import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Diamond, Heart, Leaf, Play, Users } from "lucide-react";
import { ROUTES } from "@/constants";

const benefits = [
  { icon: Diamond, title: "Premium", sub: "Services" },
  { icon: Users, title: "Expert", sub: "Professionals" },
  { icon: Heart, title: "Your Comfort", sub: "Our Priority" },
];

export default function AboutSection() {
  return (
    <section className="beauty-about" id="about">
      <div className="beauty-about-inner">
        <div className="beauty-about-copy">
          <div className="beauty-about-kicker"><Leaf size={20} /> About Us <span /></div>
          <h2>More Than a Salon<br />It&apos;s a <em>Beauty</em> Experience</h2>
          <p>At BellaLux, we believe beauty is more than just appearance - it&apos;s about confidence, self-care and feeling your best. Our expert team is dedicated to providing premium beauty services in a relaxing and luxurious environment.</p>
          <div className="beauty-about-benefits">
            {benefits.map(({ icon: Icon, title, sub }) => (
              <div key={title}><span><Icon size={25} /></span><b>{title}</b><small>{sub}</small></div>
            ))}
          </div>
          <div className="beauty-about-script">Because You Deserve the Best</div>
          <div className="beauty-about-actions">
            <Link href={ROUTES.BOOK} className="beauty-about-book">Book Appointment <ArrowRight size={17} /></Link>
            <Link href="#story" className="beauty-about-story"><span><Play size={15} fill="currentColor" /></span> Our Story</Link>
          </div>
        </div>
        <div className="beauty-about-visual">
          <div className="beauty-about-image"><Image src="/assets/hero-woman.jpg" alt="Beauty salon experience" fill sizes="50vw" /></div>
          <div className="beauty-about-stats">
            <div><b>5+</b><small>Years<br />Experience</small></div><i />
            <div><b>10K+</b><small>Happy Clients</small></div><i />
            <div><b>100%</b><small>Client Satisfaction</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
