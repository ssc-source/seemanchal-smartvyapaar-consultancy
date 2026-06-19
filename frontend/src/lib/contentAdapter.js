import { cms } from './cms';
import { content } from '../../config/content';
import { siteConfig } from '../../config/site';

/**
 * Content Adapter — Phase 7 State Recovery
 *
 * The CMS client (cms.js) already unwraps `response.data` from the API.
 * So what arrives here is the raw array or object — not wrapped in { success, data }.
 *
 * Live CMS is primary.
 * Static config/content.js is the emergency fallback only.
 * Always normalize output into stable UI-safe shapes.
 */

const safeArray = (value) => (Array.isArray(value) ? value : []);

const parseMaybeJSON = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseMaybeObject = (value) => {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
};

const SETTINGS_RESOLVE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const SETTINGS_ERROR_CACHE_TTL = 15 * 1000; // 15 seconds cache for errors to prevent retry storms
let cachedResolvedSettings = null;
let cachedResolvedSettingsExpiry = 0;
let cachedSettingsError = null;
let cachedSettingsErrorExpiry = 0;
let resolvingSettingsPromise = null;

// Timeout wrapper for API calls - fail gracefully after 2 seconds to prevent hanging
const withTimeout = async (promise, timeoutMs = 2000) => {
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

// Generic cache and deduplicator helper
const makeCachedResolver = (fetchFn, fallbackValue, label, resolveTtl = 5 * 60 * 1000, errorTtl = 15 * 1000) => {
  let cachedData = null;
  let cachedExpiry = 0;
  let cachedError = null;
  let cachedErrorExpiry = 0;
  let inFlightPromise = null;

  return async (...args) => {
    const now = Date.now();

    // 1. Check if error is cached
    if (cachedError && now < cachedErrorExpiry) {
      console.info(`[CMS CACHE] Returning fallback for ${label} (error cached to prevent retry storm)`);
      return fallbackValue;
    }

    // 2. Check if successful data is cached
    if (cachedData && now < cachedExpiry) {
      return cachedData;
    }

    // 3. Deduplicate in-flight requests
    if (inFlightPromise) {
      console.info(`[CMS DEDUP] Reusing in-flight request for ${label}`);
      return inFlightPromise;
    }

    inFlightPromise = (async () => {
      try {
        const result = await fetchFn(...args);
        cachedData = result;
        cachedExpiry = now + resolveTtl;
        cachedError = null;
        cachedErrorExpiry = 0;
        return result;
      } catch (error) {
        console.warn(`[CMS FALLBACK] ${label} failed:`, error.message);
        cachedError = error;
        cachedErrorExpiry = now + errorTtl;
        // Cache the fallback so we don't try again immediately
        cachedData = fallbackValue;
        cachedExpiry = now + resolveTtl;
        return fallbackValue;
      } finally {
        inFlightPromise = null;
      }
    })();

    return inFlightPromise;
  };
};

const cachedResolveServices = makeCachedResolver(
  async () => {
    const liveServices = safeArray(await withTimeout(cms.getServices()));
    if (liveServices.length === 0) {
      console.info('[CMS] No live services found, falling back to static.');
      return content.services;
    }
    const validServices = liveServices
      .filter((s) => s && s.isActive !== false && s.title)
      .map((s) => ({
        id: s.slug || s.id,
        slug: s.slug,
        title: s.title,
        description: s.shortDescription || s.fullDescription || '',
        details: s.fullDescription || s.shortDescription || '',
        icon: s.icon || 'Briefcase',
        idealFor: parseMaybeJSON(s.idealFor),
        outcomes: parseMaybeJSON(s.outcomes),
        modules: parseMaybeJSON(s.modules),
        isActive: s.isActive !== false,
      }));
    console.info(`[CMS] Resolved ${validServices.length} live services.`);
    return validServices.length > 0 ? validServices : content.services;
  },
  content.services,
  'Services'
);

const cachedResolveProjects = makeCachedResolver(
  async () => {
    const liveProjects = safeArray(await withTimeout(cms.getProjects()));
    if (liveProjects.length === 0) {
      console.info('[CMS] No live projects found, falling back to static.');
      return content.projects;
    }
    const firstStringValue = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim();
    const validProjects = liveProjects
      .filter((p) => p && p.isActive !== false && p.title)
      .map((p) => ({
        id: p.slug || p.id,
        slug: p.slug,
        title: p.title,
        category: p.category || 'General',
        businessType: p.businessType || '',
        clientName: p.clientName || '',
        summary: p.summary || '',
        problem: p.problem || '',
        solution: p.solution || '',
        outcome: p.outcome || '',
        tools: parseMaybeJSON(p.tools),
        href: firstStringValue(p.href, p.url, p.website) || `/projects/${p.slug}`,
        image: p.featuredImage || p.image || '',
        isActive: p.isActive !== false,
      }));
    console.info(`[CMS] Resolved ${validProjects.length} live projects.`);
    return validProjects.length > 0 ? validProjects : content.projects;
  },
  content.projects,
  'Projects'
);

const cachedResolveTestimonials = makeCachedResolver(
  async () => {
    const liveTestimonials = safeArray(await withTimeout(cms.getTestimonials()));
    if (liveTestimonials.length === 0) {
      console.info('[CMS] No live testimonials found, falling back to static.');
      return content.testimonials;
    }
    const validTestimonials = liveTestimonials
      .filter((t) => t && t.content && t.clientName)
      .map((t) => ({
        id: t.id,
        quote: t.content,
        author: t.clientName,
        role: t.clientRole || '',
        organization: t.companyName || '',
        rating: t.rating || 5,
        avatar: t.avatarUrl || '',
        context: t.context || '',
      }));
    console.info(`[CMS] Resolved ${validTestimonials.length} live testimonials.`);
    return validTestimonials.length > 0 ? validTestimonials : content.testimonials;
  },
  content.testimonials,
  'Testimonials'
);

const cachedResolveHomepage = makeCachedResolver(
  async () => {
    const liveSections = await withTimeout(cms.getHomepageSections());
    if (!liveSections || typeof liveSections !== 'object') {
      throw new Error('Invalid homepage payload');
    }
    console.info('[CMS] Resolved live homepage sections.');
    return {
      hero: {
        headline: liveSections.hero?.headline || content.hero.headline,
        subheadline: liveSections.hero?.subheadline || content.hero.subheadline,
        primaryCTA: {
          label: liveSections.hero?.primaryCTA?.label || content.hero.primaryCTA.label,
          href: liveSections.hero?.primaryCTA?.href || content.hero.primaryCTA.href,
        },
        secondaryCTA: {
          label: liveSections.hero?.secondaryCTA?.label || content.hero.secondaryCTA.label,
          href: liveSections.hero?.secondaryCTA?.href || content.hero.secondaryCTA.href,
        },
      },
      stats: Array.isArray(liveSections.stats) && liveSections.stats.length ? liveSections.stats : content.stats,
      useCases: Array.isArray(liveSections.useCases) && liveSections.useCases.length ? liveSections.useCases : content.useCases,
      whyChooseUs: Array.isArray(liveSections.whyChooseUs) && liveSections.whyChooseUs.length ? liveSections.whyChooseUs : content.whyChooseUs,
      implementationProcess: Array.isArray(liveSections.implementationProcess) && liveSections.implementationProcess.length ? liveSections.implementationProcess : content.implementationProcess,
      faqs: Array.isArray(liveSections.faqs) && liveSections.faqs.length ? liveSections.faqs : content.faqs,
    };
  },
  {
    hero: content.hero,
    stats: content.stats,
    useCases: content.useCases,
    whyChooseUs: content.whyChooseUs,
    implementationProcess: content.implementationProcess,
    faqs: content.faqs,
  },
  'Homepage'
);

const cachedResolveAbout = makeCachedResolver(
  async () => {
    const liveAboutPage = await withTimeout(cms.getContentPage('about'));
    if (liveAboutPage && typeof liveAboutPage === 'object' && liveAboutPage.content) {
      console.info('[CMS] Resolved live about content.');
      const liveContent = liveAboutPage.content;
      return {
        about: {
          story: liveContent.story || content.about.story,
          mission: liveContent.mission || content.about.mission,
          vision: liveContent.vision || content.about.vision,
        },
        stats: content.stats,
        whyChooseUs: content.whyChooseUs,
      };
    }
    throw new Error('Invalid about content payload');
  },
  {
    about: content.about,
    stats: content.stats,
    whyChooseUs: content.whyChooseUs,
  },
  'About'
);

export const contentAdapter = {
  async resolveServices() {
    return cachedResolveServices();
  },

  async resolveProjects() {
    return cachedResolveProjects();
  },

  async resolveSettings() {
    const now = Date.now();
    
    // Check if we have a cached error (prevent retry storms)
    if (cachedSettingsError && now < cachedSettingsErrorExpiry) {
      console.info('[CMS CACHE] Returning fallback (error cached to prevent retry storm)');
      return siteConfig;
    }
    
    // Check successful cache
    if (cachedResolvedSettings && now < cachedResolvedSettingsExpiry) {
      return cachedResolvedSettings;
    }

    // Only one concurrent resolution
    if (resolvingSettingsPromise) {
      console.info('[CMS DEDUP] Reusing in-flight settings request');
      return resolvingSettingsPromise;
    }

    resolvingSettingsPromise = (async () => {
      try {
        const liveSettings = await withTimeout(cms.getSettings());

        if (!liveSettings || typeof liveSettings !== 'object') {
          throw new Error('Invalid settings payload');
        }

        console.info('[CMS] Resolved live settings.');

        const resolved = {
          ...siteConfig,
          name: liveSettings.siteName || siteConfig.name,
          contact: {
            ...siteConfig.contact,
            email: liveSettings.email || liveSettings.contactEmail || siteConfig.contact.email,
            phone: liveSettings.phone || liveSettings.contactPhone || siteConfig.contact.phone,
            address: liveSettings.address || siteConfig.contact.address,
          },
          links: {
            ...siteConfig.links,
            facebook: liveSettings.facebookUrl || siteConfig.links.facebook,
            linkedin: liveSettings.linkedinUrl || siteConfig.links.linkedin,
            instagram: liveSettings.instagramUrl || siteConfig.links.instagram,
            twitter: liveSettings.twitterUrl || siteConfig.links.twitter,
          },
        };

        cachedResolvedSettings = resolved;
        cachedResolvedSettingsExpiry = now + SETTINGS_RESOLVE_CACHE_TTL;
        
        // Clear error cache on success
        cachedSettingsError = null;
        cachedSettingsErrorExpiry = 0;
        
        return resolved;
      } catch (error) {
        console.warn('[CMS FALLBACK] Settings:', error.message);
        
        // Cache the error to prevent immediate retries and request storms
        cachedSettingsError = error;
        cachedSettingsErrorExpiry = now + SETTINGS_ERROR_CACHE_TTL;
        
        // Also cache fallback
        cachedResolvedSettings = siteConfig;
        cachedResolvedSettingsExpiry = now + SETTINGS_RESOLVE_CACHE_TTL;
        
        return siteConfig;
      } finally {
        resolvingSettingsPromise = null;
      }
    })();

    return resolvingSettingsPromise;
  },

  async resolveTestimonials() {
    return cachedResolveTestimonials();
  },

  async resolveHomepage() {
    return cachedResolveHomepage();
  },

  async resolveAbout() {
    return cachedResolveAbout();
  },

  async resolveCareerOpenings(fallbackOpenings = []) {
    try {
      const liveOpenings = safeArray(await withTimeout(cms.getCareerOpenings()));
      if (liveOpenings.length === 0) {
        console.info('[CMS] No live career openings found, falling back to static.');
        return fallbackOpenings;
      }

      const normalizeType = (employmentType) => {
        switch (employmentType) {
          case 'FULL_TIME':
            return 'Full Time';
          case 'PART_TIME':
            return 'Part Time';
          case 'CONTRACT':
            return 'Contract';
          case 'INTERNSHIP':
          default:
            return 'Internship';
        }
      };

      const validOpenings = liveOpenings
        .filter((opening) => opening && opening.title && opening.department)
        .map((opening) => ({
          title: opening.title,
          department: opening.department,
          type: normalizeType(opening.employmentType),
          location: opening.location || '',
          experience: opening.experience || '',
          description: opening.description || '',
          skills: parseMaybeJSON(opening.skills),
        }));

      return validOpenings.length > 0 ? validOpenings : fallbackOpenings;
    } catch (error) {
      console.warn('[CMS FALLBACK] Career Openings:', error.message);
      return fallbackOpenings;
    }
  },

  async resolveCommunity({ fallbackGroups = [], fallbackEvents = [] } = {}) {
    try {
      const liveItems = safeArray(await withTimeout(cms.getCommunityItems()));
      if (liveItems.length === 0) {
        console.info('[CMS] No live community items found, falling back to static.');
        return { communities: fallbackGroups, events: fallbackEvents };
      }

      const groups = liveItems
        .filter((item) => item.type === 'GROUP')
        .map((item) => ({
          title: item.title,
          description: item.description || '',
          tags: parseMaybeJSON(item.metadata?.tags),
          iconName: item.metadata?.icon || '',
        }));

      const events = liveItems
        .filter((item) => item.type !== 'GROUP')
        .map((item) => ({
          title: item.title,
          date: item.metadata?.date || '',
          type: item.metadata?.eventType || item.type || '',
        }));

      return {
        communities: groups.length > 0 ? groups : fallbackGroups,
        events: events.length > 0 ? events : fallbackEvents,
      };
    } catch (error) {
      console.warn('[CMS FALLBACK] Community:', error.message);
      return { communities: fallbackGroups, events: fallbackEvents };
    }
  },

  async resolveContact() {
    return content;
  },

  async getPrivacyPolicy() {
    try {
      const livePrivacy = parseMaybeObject(await withTimeout(cms.getPrivacyPolicy(), 5000));

      if (!livePrivacy) {
        throw new Error('Invalid privacy policy payload');
      }

      console.info('[CMS] Resolved live privacy policy.');

      return {
        title: livePrivacy.title || content.privacyPolicy.title,
        description: livePrivacy.description || content.privacyPolicy.description,
        dataCollection: {
          title: livePrivacy.dataCollection?.title || content.privacyPolicy.dataCollection.title,
          description: livePrivacy.dataCollection?.description || content.privacyPolicy.dataCollection.description,
        },
        dataUsage: {
          title: livePrivacy.dataUsage?.title || content.privacyPolicy.dataUsage.title,
          description: livePrivacy.dataUsage?.description || content.privacyPolicy.dataUsage.description,
        },
        dataSharing: {
          title: livePrivacy.dataSharing?.title || content.privacyPolicy.dataSharing.title,
          description: livePrivacy.dataSharing?.description || content.privacyPolicy.dataSharing.description,
        },
        userRights: {
          title: livePrivacy.userRights?.title || content.privacyPolicy.userRights.title,
          description: livePrivacy.userRights?.description || content.privacyPolicy.userRights.description,
        },
      };
    } catch (error) {
      console.warn('[CMS FALLBACK] Privacy Policy:', error.message);
      return content.privacyPolicy;
    }
  },
  async getTermsOfService() {
    try {
      const liveTerms = parseMaybeObject(await withTimeout(cms.getTermsOfService(), 5000));

      if (!liveTerms) {
        throw new Error('Invalid terms of service payload');
      }

      console.info('[CMS] Resolved live terms of service.');

      return {
        title: liveTerms.title || content.termsOfService.title,
        description: liveTerms.description || content.termsOfService.description,
        useOfServices: liveTerms.useOfServices || content.termsOfService.useOfServices,
        intellectualProperty:
          liveTerms.intellectualProperty || content.termsOfService.intellectualProperty,
        disclaimers: liveTerms.disclaimers || content.termsOfService.disclaimers,
        modifications: liveTerms.modifications || content.termsOfService.modifications,
        contact:
          liveTerms.contact || content.termsOfService.contact,
      };
    } catch (error) {
      console.warn('[CMS FALLBACK] Terms of Service:', error.message);
      return content.termsOfService;
    }
  }
};