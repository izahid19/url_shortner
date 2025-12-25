// SEO Configuration for Trimmm URL Shortener
// Centralized metadata configuration

export const siteConfig = {
  siteName: "Trimmm",
  siteUrl: "https://trimmm.netlify.app",
  defaultTitle: "Trimmm - The Modern URL Shortener",
  defaultDescription: "Shorten URLs, generate QR codes, and track every click with powerful analytics. Create short, memorable links in seconds. Free URL shortener with detailed click analytics.",
  defaultKeywords: "url shortener, link shortener, short url, qr code generator, link analytics, click tracking, custom short links, free url shortener",
  author: "Zahid Mushtaq",
  authorUrl: "https://devzahid.vercel.app",
  themeColor: "#f97316",
  locale: "en_US",
  
  // Social Media
  twitter: {
    handle: "@trimmm",
    cardType: "summary_large_image",
  },
  
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Trimmm",
  },
  
  // Default OG Image
  defaultOgImage: "https://trimmm.netlify.app/og-image.webp",
  
  // JSON-LD Organization schema
  organization: {
    name: "Trimmm",
    url: "https://trimmm.netlify.app",
    logo: "https://trimmm.netlify.app/logo.png",
    description: "Modern URL shortener with powerful analytics and QR code generation.",
  },
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "Trimmm - The Modern URL Shortener | Free Link Shortening & Analytics",
    description: "Shorten URLs, generate QR codes, and track every click with powerful analytics. The only URL shortener you'll ever need. Free forever.",
    keywords: "url shortener, link shortener, free url shortener, qr code generator, link analytics, click tracking",
  },
  auth: {
    title: "Sign In or Create Account | Trimmm",
    description: "Create your free Trimmm account to start shortening URLs, generating QR codes, and tracking link analytics.",
    noindex: true,
  },
  dashboard: {
    title: "Dashboard | Trimmm",
    description: "Manage your shortened URLs, view analytics, and create new links.",
    noindex: true, // Private user content
  },
  link: {
    title: "Link Details | Trimmm",
    description: "View detailed analytics for your shortened URL.",
    noindex: true, // Private user content
  },
  profile: {
    title: "Profile Settings | Trimmm",
    description: "Manage your Trimmm account settings and preferences.",
    noindex: true, // Private user content
  },
  notFound: {
    title: "Page Not Found | Trimmm",
    description: "The page you're looking for doesn't exist.",
    noindex: true,
  },
};

export default siteConfig;
