import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Playfair_Display, Raleway } from "next/font/google";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ThemeProvider from "@/components/layout/ThemeProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Glamour Studio — Premium Salon & Spa",
  description:
    "Book haircut, beard, facial, color, massage & more at Glamour Studio. Islamabad's top-rated salon.",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${cormorant.variable} ${raleway.variable} ${playfair.variable} ${greatVibes.variable} h-full overflow-x-hidden`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden w-full max-w-full" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
          {children}
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
