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

export const contentAdapter = {
  async resolveServices() {
    try {
      const liveServices = safeArray(await cms.getServices());

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
    } catch (error) {
      console.warn('[CMS FALLBACK] Services:', error.message);
      return content.services;
    }
  },

  async resolveProjects() {
    try {
      const liveProjects = safeArray(await cms.getProjects());

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
    } catch (error) {
      console.warn('[CMS FALLBACK] Projects:', error.message);
      return content.projects;
    }
  },

  async resolveSettings() {
    try {
      const liveSettings = await cms.getSettings();

      if (!liveSettings || typeof liveSettings !== 'object') {
        throw new Error('Invalid settings payload');
      }

      console.info('[CMS] Resolved live settings.');

      return {
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
    } catch (error) {
      console.warn('[CMS FALLBACK] Settings:', error.message);
      return siteConfig;
    }
  },

  async resolveTestimonials() {
    try {
      const liveTestimonials = safeArray(await cms.getTestimonials());

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
    } catch (error) {
      console.warn('[CMS FALLBACK] Testimonials:', error.message);
      return content.testimonials;
    }
  },

  async resolveHomepage() {
    try {
      const liveSections = await cms.getHomepageSections();

      if (!liveSections || typeof liveSections !== 'object') {
        throw new Error('Invalid homepage payload');
      }

      console.info('[CMS] Resolved live homepage sections.');

      return {
        hero: {
          headline:
            liveSections.hero?.headline ||
            content.hero.headline,
          subheadline:
            liveSections.hero?.subheadline ||
            content.hero.subheadline,
          primaryCTA: {
            label:
              liveSections.hero?.primaryCTA?.label ||
              content.hero.primaryCTA.label,
            href:
              liveSections.hero?.primaryCTA?.href ||
              content.hero.primaryCTA.href,
          },
          secondaryCTA: {
            label:
              liveSections.hero?.secondaryCTA?.label ||
              content.hero.secondaryCTA.label,
            href:
              liveSections.hero?.secondaryCTA?.href ||
              content.hero.secondaryCTA.href,
          },
        },
        stats:
          Array.isArray(liveSections.stats) && liveSections.stats.length
            ? liveSections.stats
            : content.stats,
        useCases:
          Array.isArray(liveSections.useCases) && liveSections.useCases.length
            ? liveSections.useCases
            : content.useCases,
        whyChooseUs:
          Array.isArray(liveSections.whyChooseUs) && liveSections.whyChooseUs.length
            ? liveSections.whyChooseUs
            : content.whyChooseUs,
        implementationProcess:
          Array.isArray(liveSections.implementationProcess) && liveSections.implementationProcess.length
            ? liveSections.implementationProcess
            : content.implementationProcess,
        faqs:
          Array.isArray(liveSections.faqs) && liveSections.faqs.length
            ? liveSections.faqs
            : content.faqs,
      };
    } catch (error) {
      console.warn('[CMS FALLBACK] Homepage:', error.message);

      return {
        hero: content.hero,
        stats: content.stats,
        useCases: content.useCases,
        whyChooseUs: content.whyChooseUs,
        implementationProcess: content.implementationProcess,
        faqs: content.faqs,
      };
    }
  },

  async resolveAbout() {
    return {
      about: content.about,
      stats: content.stats,
      whyChooseUs: content.whyChooseUs,
    };
  },

  async resolveContact() {
    return content;
  },

  async getPrivacyPolicy() {
    try {
      const livePrivacy = await cms.getPrivacyPolicy();

      if (!livePrivacy || typeof livePrivacy !== 'object') {
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
      const liveTerms = await cms.getTermsOfService();

      if (!liveTerms || typeof liveTerms !== 'object') {
        throw new Error('Invalid terms of service payload');
      }

      console.info('[CMS] Resolved live terms of service.');

      return {
        title: liveTerms.title || content.termsOfService.title,
        description: liveTerms.description || content.termsOfService.description,
        useOfServices: liveTerms.useOfServices || content.termsOfService.useOfServices,
        intellectualProperty: liveTerms.intellectualProperty || content.termsOfService.intellectualProperty,
        disclaimers: liveTerms.disclaimers || content.termsOfService.disclaimers,
        modifications: liveTerms.modifications || content.termsOfService.modifications,
      };
    } catch (error) {
      console.warn('[CMS FALLBACK] Terms of Service:', error.message);
      return content.termsOfService;
    }
  }
};