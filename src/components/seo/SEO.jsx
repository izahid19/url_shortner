import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/seo.config';

/**
 * SEO Component - Handles all meta tags for a page
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.canonicalUrl - Canonical URL
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type
 * @param {boolean} props.noindex - Whether to noindex the page
 * @param {boolean} props.nofollow - Whether to nofollow the page
 * @param {React.ReactNode} props.children - Additional head elements (JSON-LD, etc.)
 */
const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noindex = false,
  nofollow = false,
  children,
}) => {
  const fullTitle = title || siteConfig.defaultTitle;
  const metaDescription = description || siteConfig.defaultDescription;
  const metaKeywords = keywords || siteConfig.defaultKeywords;
  const canonical = canonicalUrl || siteConfig.siteUrl;
  const image = ogImage || siteConfig.defaultOgImage;
  
  // Build robots meta content
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={siteConfig.author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:locale" content={siteConfig.locale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={siteConfig.twitter.cardType} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional tags passed as children */}
      {children}
    </Helmet>
  );
};

export default SEO;
