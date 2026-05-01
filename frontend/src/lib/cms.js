const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class CmsClient {
  async fetchApi(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
}

export const cms = new CmsClient();
