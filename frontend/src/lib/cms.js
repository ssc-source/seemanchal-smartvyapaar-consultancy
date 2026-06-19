import { API_BASE_URL } from './api';
import { siteConfig } from "../../config/site";

const API_BASE = API_BASE_URL;

const SETTINGS_CACHE_TTL = 30 * 1000;
let cachedSettings = null;
let cachedSettingsExpiry = 0;
let settingsRequestPromise = null;

class CmsClient {
  async fetchApi(endpoint) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        next: { revalidate: 3600 },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`CMS API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data; // Assumes our API always returns { success: true, data: [...] }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`CMS API timeout after 5s: ${endpoint}`);
      }
      throw error;
    }
  }

  async getServices() {
    return this.fetchApi('/api/services');
  }

  async getProjects() {
    return this.fetchApi('/api/projects');
  }

  async getSettings() {
    const now = Date.now();

    if (cachedSettings && now < cachedSettingsExpiry) {
      return cachedSettings;
    }

    if (settingsRequestPromise) {
      return settingsRequestPromise;
    }

    settingsRequestPromise = this.fetchApi('/api/settings')
      .then((data) => {
        cachedSettings = data;
        cachedSettingsExpiry = Date.now() + SETTINGS_CACHE_TTL;
        settingsRequestPromise = null;
        return cachedSettings;
      })
      .catch((error) => {
        settingsRequestPromise = null;
        throw error;
      });

    return settingsRequestPromise;
  }

  async getTestimonials() {
    return this.fetchApi('/api/testimonials');
  }

  async getHomepageSections() {
    return this.fetchApi('/api/homepage-sections');
  }

  async getContentPages() {
    return this.fetchApi('/api/content-pages');
  }

  async getContentPage(slug) {
    return this.fetchApi(`/api/content-pages/${encodeURIComponent(slug)}`);
  }

  async getCareerOpenings() {
    return this.fetchApi('/api/job-openings');
  }

  async getCommunityItems() {
    return this.fetchApi('/api/community-items');
  }

  async getPrivacyPolicy() {
    return this.fetchApi('/api/content-pages/privacy-policy');
  }

  async getTermsOfService() {
    return this.fetchApi('/api/content-pages/terms-of-service');
  }
}

export const cms = new CmsClient();
