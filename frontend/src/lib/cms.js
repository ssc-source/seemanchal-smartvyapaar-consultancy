const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }

  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().replace(/\/$/, '');
  }

  return 'http://localhost:5000';
};

class CmsClient {
  async fetchApi(endpoint) {
    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds (Next.js App Router cache)
    });
    
    if (!response.ok) {
      throw new Error(`CMS API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data; // Assumes our API always returns { success: true, data: [...] }
  }

  async getServices() {
    return this.fetchApi('/api/services');
  }

  async getProjects() {
    return this.fetchApi('/api/projects');
  }

  async getSettings() {
    return this.fetchApi('/api/settings');
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
