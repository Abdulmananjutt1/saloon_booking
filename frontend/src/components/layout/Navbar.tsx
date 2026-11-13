"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { APP_NAME, NAV_LINKS, ROUTES, SERVICE_CATEGORIES } from "@/constants";
import { Calendar, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { getSession, isAdmin, SessionUser } from "@/lib/session";

function LotusMark() {
  return (
    <svg className="lux-nav-lotus" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 8c1.2 4.6 2 8.4 2 12.2 0 3.2-.6 6.2-2 9.8-1.4-3.6-2-6.6-2-9.8C22 16.4 22.8 12.6 24 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M24 12c3.4 3.2 6.8 5 10.2 5.6-3.2 2.4-6.6 4.2-10.2 6.2-3.6-2-7-3.8-10.2-6.2C17.2 17 20.6 15.2 24 12Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M16 18c2.8 4.4 4.8 8 5.8 12.4C18 28.6 14.4 26 11 22.2 13 20.6 14.6 19.2 16 18Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M32 18c-2.8 4.4-4.8 8-5.8 12.4C30 28.6 33.6 26 37 22.2 35 20.6 33.4 19.2 32 18Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M12 24c3.8 3.2 7.6 5.2 12 7.6 4.4-2.4 8.2-4.4 12-7.6"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M24 32c0 2.4.2 4.6 1.4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M24 32c0 2.4-.2 4.6-1.4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 34c-2.2 2.6-4.4 4.4-7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M28 34c2.2 2.6 4.4 4.4 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    try {
      const u = getSession();
      if (u) {
        const id = requestAnimationFrame(() => setUser(u));
        return () => {
          window.removeEventListener("scroll", fn);
          cancelAnimationFrame(id);
        };
      }
    } catch {
      /* ignore */
    }
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const dashboardUrl = isAdmin(user) ? ROUTES.ADMIN : ROUTES.DASHBOARD;
  const links = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Services", href: ROUTES.SERVICES, dropdown: true },
    { label: "About", href: ROUTES.ABOUT },
    { label: "Gallery", href: ROUTES.GALLERY },
    { label: "Blogs", href: ROUTES.BLOGS },
    { label: "Contact", href: ROUTES.CONTACT },
  ];

  return (
    <>
      <button
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Light mode" : "Dark mode"}
        className="lux-theme-fab"
      >
        {theme === "dark" ? (
          <Sun style={{ width: 22, height: 22, color: "var(--gold)" }} />
        ) : (
          <Moon style={{ width: 22, height: 22, color: "var(--gold)" }} />
        )}
      </button>

      <header className={`lux-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="sal-container lux-nav-inner">
          <Link href={ROUTES.HOME} className="lux-brand">
            <LotusMark />
            <span>
              <span className="lux-brand-name">{APP_NAME}</span>
              <span className="lux-brand-sub">Beauty Salon</span>
            </span>
          </Link>

          <nav className="lux-nav-links" aria-label="Primary">
            {links.map((l) =>
              l.dropdown ? (
                <div key={l.label} className="lux-nav-drop">
                  <Link
                    href={l.href}
                    className={`lux-nav-link ${pathname.startsWith(ROUTES.SERVICES) ? "is-active" : ""}`}
                  >
                    {l.label}
                    <ChevronDown style={{ width: 13, height: 13 }} />
                  </Link>
                  <div className="lux-nav-menu">
                    {SERVICE_CATEGORIES.map((c) => (
                      <Link key={c.value} href={`${ROUTES.SERVICES}?cat=${c.value}`}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`lux-nav-link ${pathname === l.href ? "is-active" : ""}`}
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <div className="lux-nav-cta">
            {user ? (
              <Link href={dashboardUrl} className="lux-nav-ghost">
                Dashboard
              </Link>
            ) : null}
            <Link href={ROUTES.BOOK} className="lux-btn-dark lux-nav-book">
              <Calendar style={{ width: 15, height: 15 }} />
              Book Appointment
            </Link>
          </div>

          <button
            className="lux-nav-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>

        {open && (
          <div className="lux-nav-mobile">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <button
              className="lux-nav-mobile-toggle"
              onClick={() => setServicesOpen((v) => !v)}
            >
              All Services
              <ChevronDown style={{ width: 14, height: 14, transform: servicesOpen ? "rotate(180deg)" : undefined }} />
            </button>
            {servicesOpen &&
              SERVICE_CATEGORIES.map((c) => (
                <Link
                  key={c.value}
                  href={`${ROUTES.SERVICES}?cat=${c.value}`}
                  onClick={() => setOpen(false)}
                  className="lux-nav-mobile-sub"
                >
                  {c.label}
                </Link>
              ))}
            <Link href="/#reviews" onClick={() => setOpen(false)}>
              Reviews
            </Link>
            {user ? (
              <Link href={dashboardUrl} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                Sign In
              </Link>
            )}
            <Link href={ROUTES.BOOK} onClick={() => setOpen(false)} className="lux-btn-dark lux-nav-mobile-book">
              Book Appointment
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
