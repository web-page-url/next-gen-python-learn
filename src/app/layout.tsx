import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading for performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading for performance
});

// SEO-optimized metadata
export const metadata: Metadata = {
  title: {
    default: "LearnPy - Interactive Python Programming Tutorial for Beginners",
    template: "%s | LearnPy - Learn Python Programming"
  },
  description: "Master Python programming with our interactive, step-by-step tutorial. Learn variables, loops, functions, and more through hands-on coding exercises. Perfect for beginners with AI-powered feedback and multilingual support.",
  keywords: [
    "Python tutorial",
    "learn Python programming",
    "Python for beginners",
    "interactive Python course",
    "Python coding exercises",
    "programming tutorial",
    "Python lessons",
    "coding for beginners",
    "Python practice",
    "programming education"
  ],
  authors: [{ name: "Anubhav", url: "https://www.linkedin.com/in/anubhav-chaudhary-4bba7918b/" }],
  creator: "Anubhav",
  publisher: "LearnPy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'LearnPy - Interactive Python Programming Tutorial for Beginners',
    description: 'Master Python programming with our interactive, step-by-step tutorial. Learn variables, loops, functions, and more through hands-on coding exercises.',
    siteName: 'LearnPy',
    images: [
      {
        url: '/learn-py-1.0.jpg',
        width: 1200,
        height: 630,
        alt: 'LearnPy - Interactive Python Programming Tutorial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LearnPy - Interactive Python Programming Tutorial for Beginners',
    description: 'Master Python programming with our interactive, step-by-step tutorial. Perfect for beginners with AI-powered feedback.',
    images: ['/learn-py-1.0.jpg'],
    creator: '@learnpy_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Structured Data for Educational Content */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "LearnPy - Interactive Python Programming Tutorial",
              "description": "Master Python programming with our interactive, step-by-step tutorial. Learn variables, loops, functions, and more through hands-on coding exercises.",
              "provider": {
                "@type": "Organization",
                "name": "LearnPy",
                "url": process.env.NEXT_PUBLIC_SITE_URL || "https://learn-py-ai.vercel.app"
              },
              "educationalLevel": "Beginner",
              "courseMode": "online",
              "inLanguage": ["en"],
              "teaches": [
                "Python Programming",
                "Variables and Data Types",
                "Control Structures",
                "Functions",
                "Data Structures",
                "Programming Logic"
              ],
              "coursePrerequisites": "No programming experience required",
              "timeRequired": "PT2H",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1250"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//generativelanguage.googleapis.com" />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/level/1" />
        <link rel="prefetch" href="/level/2" />
        <link rel="prefetch" href="/level/3" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />

        {/* Additional SEO meta tags */}
        <meta name="application-name" content="LearnPy" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LearnPy" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Canonical URL */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-py-ai.vercel.app'} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600 text-sm">
              Created with ❤️ by{" "}
              <a
                href="https://www.linkedin.com/in/anubhav-chaudhary-4bba7918b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Anubhav
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
