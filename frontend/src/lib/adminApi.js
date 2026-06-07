const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().replace(/\/$/, '');
  }

  return 'http://localhost:5000';
};

class AdminApi {
  constructor() {
    this.token = null;
    this.isAuthenticated = false;
    if (typeof window !== 'undefined') {
      this.isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    }
  }

  setToken(token) {
    // Backward-compatible in-memory token only. Persistent JWT storage was removed in Phase 2.
    this.token = typeof token === 'string' ? token : null;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        this.isAuthenticated = true;
      } else {
        sessionStorage.removeItem('adminAuthenticated');
        this.isAuthenticated = false;
      }
    }
  }

  async request(endpoint, options = {}, retry = true) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`API Error: Expected JSON but got ${contentType || 'unknown'} (Status: ${response.status})`);
    }

    if (!response.ok) {
      if (response.status === 401 && retry && endpoint !== '/api/auth/login' && endpoint !== '/api/auth/refresh') {
        try {
          await this.refresh();
          return this.request(endpoint, options, false);
        } catch {
          this.setToken(null);
        }
      }

      if (response.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      throw new Error(result.message || 'API Error');
    }

    return result;
  }

  async login(email, password) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token || result.data?.accessToken || true);
    return result;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' }, false);
    } finally {
      this.setToken(null);
    }
  }

  async refresh() {
    const result = await this.request('/api/auth/refresh', { method: 'POST' }, false);
    this.setToken(result.data?.accessToken || true);
    return result;
  }

  async me() {
    return this.request('/api/auth/me');
  }

  // --- Leads ---
  async getLeads() {
    return this.request('/api/admin/leads');
  }

  async updateLead(id, data) {
    return this.request(`/api/admin/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // --- Services ---
  async getServices() {
    return this.request('/api/admin/services');
  }

  async createService(data) {
    return this.request('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id, data) {
    return this.request(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id) {
    return this.request(`/api/admin/services/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Projects ---
  async getProjects() {
    return this.request('/api/admin/projects');
  }

  async createProject(data) {
    return this.request('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id, data) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id) {
    return this.request(`/api/admin/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Settings ---
  async getSettings() {
    return this.request('/api/admin/settings');
  }

  async updateSetting(key, value) {
    return this.request(`/api/admin/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  }

  async batchUpdateSettings(settings) {
    return this.request('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  // --- Homepage Sections ---
  async getHomepageSections() {
    return this.request('/api/admin/homepage-sections');
  }

  async createHomepageSection(data) {
    return this.request('/api/admin/homepage-sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHomepageSection(id, data) {
    return this.request(`/api/admin/homepage-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHomepageSection(id) {
    return this.request(`/api/admin/homepage-sections/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Content Pages ---
  async getContentPages() {
    return this.request('/api/admin/content-pages');
  }

  async getContentPage(id) {
    return this.request(`/api/admin/content-pages/${id}`);
  }

  async createContentPage(data) {
    return this.request('/api/admin/content-pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateContentPage(id, data) {
    return this.request(`/api/admin/content-pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContentPage(id) {
    return this.request(`/api/admin/content-pages/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Job Openings ---
  async getJobOpenings() {
    return this.request('/api/admin/job-openings');
  }

  async getJobOpening(id) {
    return this.request(`/api/admin/job-openings/${id}`);
  }

  async createJobOpening(data) {
    return this.request('/api/admin/job-openings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobOpening(id, data) {
    return this.request(`/api/admin/job-openings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobOpening(id) {
    return this.request(`/api/admin/job-openings/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Community Items ---
  async getCommunityItems() {
    return this.request('/api/admin/community-items');
  }

  async getCommunityItem(id) {
    return this.request(`/api/admin/community-items/${id}`);
  }

  async createCommunityItem(data) {
    return this.request('/api/admin/community-items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCommunityItem(id, data) {
    return this.request(`/api/admin/community-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCommunityItem(id) {
    return this.request(`/api/admin/community-items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminApi = new AdminApi();
