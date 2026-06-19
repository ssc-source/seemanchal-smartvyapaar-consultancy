import { cms } from "./cms";
import { siteConfig } from "../../config/site";
import { API_BASE_URL } from './api';

const API_BASE = API_BASE_URL;

// Timeout wrapper for API calls - fail gracefully after 3 seconds
const withTimeout = async (promise, timeoutMs = 3000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('API call timeout')), timeoutMs);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

const seoCache = {};
const seoCacheExpiry = {};
const seoErrorCache = {};
const seoErrorCacheExpiry = {};
const SEO_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const SEO_ERROR_TTL = 15 * 1000; // 15 seconds

export async function getSeoMetadata(pageKey) {
  const now = Date.now();

  // 1. Check if error is cached
  if (seoErrorCache[pageKey] && now < seoErrorCacheExpiry[pageKey]) {
    console.info(`[SEO CACHE] Returning fallback for ${pageKey} (error cached)`);
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  // 2. Check if successful metadata is cached
  if (seoCache[pageKey] && now < seoCacheExpiry[pageKey]) {
    return seoCache[pageKey];
  }

  const fetchSeo = async () => {
    // Try DB-driven SEO first with 5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(`${API_BASE}/api/seo/${encodeURIComponent(pageKey)}`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json.data) return json.data;
      }
    } catch (err) {
      // swallow and fallback
      if (err.name === 'AbortError') {
        console.warn('SEO API timeout after 5s');
      } else {
        console.warn('SEO API error', err);
      }
    }

    // Try existing content sources with timeout
    try {
      // map common keys to content endpoints
      switch (pageKey) {
        case "home": {
          // Optimized: Removed redundant cms.getHomepageSections() call since result is ignored
          return {
            title: siteConfig.name,
            description: siteConfig.description,
          };
        }
        case "about": {
          const about = await withTimeout(cms.getContentPage('about'), 3000);
          if (about) return { title: about.title, description: about.seoDescription || about.description };
          break;
        }
        case "privacy-policy": {
          const p = await withTimeout(cms.getPrivacyPolicy(), 3000);
          if (p) return { title: p.title, description: p.description };
          break;
        }
        case "terms-of-service": {
          const t = await withTimeout(cms.getTermsOfService(), 3000);
          if (t) return { title: t.title, description: t.description };
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.warn('CMS fallback error', err?.message || err);
    }

    // Final fallback: site config
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  };

  try {
    const data = await fetchSeo();
    seoCache[pageKey] = data;
    seoCacheExpiry[pageKey] = now + SEO_CACHE_TTL;
    delete seoErrorCache[pageKey];
    delete seoErrorCacheExpiry[pageKey];
    return data;
  } catch (error) {
    console.warn(`[SEO] Failed to resolve metadata for ${pageKey}:`, error.message);
    seoErrorCache[pageKey] = error;
    seoErrorCacheExpiry[pageKey] = now + SEO_ERROR_TTL;
    
    // Set fallback in cache to avoid retry storm
    const fallback = {
      title: siteConfig.name,
      description: siteConfig.description,
    };
    seoCache[pageKey] = fallback;
    seoCacheExpiry[pageKey] = now + SEO_CACHE_TTL;
    return fallback;
  }
}

export async function generatePageMetadata(pageKey, fallbackMetadata = {}) {
  // Ensure metadata generation completes within 3 seconds
  const seo = await withTimeout(getSeoMetadata(pageKey), 3000).catch(() => null);
  const site = siteConfig;
  const data = {
    title: seo?.title || fallbackMetadata.title || site.name,
    description: seo?.description || fallbackMetadata.description || site.description,
    keywords: seo?.metaKeywords || fallbackMetadata.keywords || undefined,
    canonical: seo?.canonicalUrl || fallbackMetadata.canonical || site.url,
    robots: seo?.robots || fallbackMetadata.robots || undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.title || site.name,
      description: seo?.ogDescription || seo?.description || site.description,
      url: seo?.canonicalUrl || site.url,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : (site.ogImage ? [{ url: site.ogImage }] : []),
    },
    twitter: {
      title: seo?.twitterTitle || seo?.ogTitle || seo?.title || site.name,
      description: seo?.twitterDescription || seo?.ogDescription || seo?.description || site.description,
      images: seo?.twitterImage ? [{ url: seo.twitterImage }] : (seo?.ogImage ? [{ url: seo.ogImage }] : []),
    },
  };

  // Build Next.js compatible metadata object
  const metadata = {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: data.canonical },
    robots: data.robots ? { index: data.robots.includes('index'), follow: data.robots.includes('follow') } : undefined,
    openGraph: {
      title: data.openGraph.title,
      description: data.openGraph.description,
      url: data.openGraph.url,
      images: data.openGraph.images,
      type: 'website',
      siteName: site.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.twitter.title,
      description: data.twitter.description,
      images: data.twitter.images?.map(i=>i.url) || [],
    },
  };

  return metadata;
}
