import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SITE_TAGLINE, SITE_URL } from "@/lib/config";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pyre — the dev buys first, then burns it",
    template: "%s — Pyre",
  },
  description:
    "Pump.fun launches where the dev buys first, then burns 100% of it — provably zero dev bag, forever. Verify any burn on-chain.",
  openGraph: {
    title: "Pyre — the dev buys first, then burns it",
    description:
      "Pump.fun launches where the dev buys first then burns it — zero dev bag, verified on-chain.",
    url: SITE_URL,
    siteName: "Pyre",
    images: [{ url: "/branding/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pyre — the dev buys first, then burns it",
    description: SITE_TAGLINE,
    images: ["/branding/og.png"],
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${silkscreen.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
