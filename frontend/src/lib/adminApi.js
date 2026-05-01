const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class AdminApi {
  constructor() {
    this.token = null;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('adminToken');
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('adminToken', token);
      } else {
        localStorage.removeItem('adminToken');
      }
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
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
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
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
}

export const adminApi = new AdminApi();
