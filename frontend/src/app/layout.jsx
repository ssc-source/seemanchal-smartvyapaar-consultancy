import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "../../config/site";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": siteConfig.name,
              "image": siteConfig.logo,
              "@id": siteConfig.url,
              "url": siteConfig.url,
              "telephone": siteConfig.contact.phone,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": siteConfig.contact.address,
                "addressLocality": "Araria",
                "addressRegion": "Bihar",
                "addressCountry": "IN"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <MobileBottomNav />
        <Footer />
      </body>
    </html>
  );
}
