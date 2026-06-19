import { API_BASE_URL } from './api';

const getApiBaseUrl = () => API_BASE_URL;

class AdminApi {
  constructor() {
    this.token = null;
    this.isAuthenticated = false;
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem('adminToken') || null;
      this.isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    }
  }

  setToken(token) {
    this.token = typeof token === 'string' ? token : null;
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminToken', this.token);
        this.isAuthenticated = true;
      } else {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminToken');
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const url = `${getApiBaseUrl()}${endpoint}`;
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[AdminAPI] request', {
          url,
          method: options.method || 'GET',
          endpoint,
          bodyPresent: options.body ? true : false,
        });
      }
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`API Error: Expected JSON but got ${contentType || 'unknown'} (Status: ${response.status})`);
      }

      if (!response.ok) {
        if (response.status === 401 && retry && !endpoint.includes('/login') && !endpoint.includes('/refresh')) {
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
        
        // Defensive error message extraction - safe property access
        let errorMessage = 'API Error';
        if (result && typeof result === 'object') {
          errorMessage = result.message || result.error || result.statusText || 'API Error';
        }
        
        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error(`Admin API request timeout after 10s: ${endpoint}`);
      }
      throw error;
    }
  }

  async login(email, password) {
    const result = await this.request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token || result.data?.accessToken || true);
    return result;
  }

  async logout() {
    try {
      await this.request('/api/admin/auth/logout', { method: 'POST' }, false);
    } finally {
      this.setToken(null);
    }
  }

  async refresh() {
    const result = await this.request('/api/admin/auth/refresh', { method: 'POST' }, false);
    this.setToken(result.data?.accessToken || true);
    return result;
  }

  async me() {
    return this.request('/api/admin/auth/me');
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

  async getFutureSkillsInquiries(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/future-skills/inquiries${qs ? `?${qs}` : ''}`);
  }

  async getFutureSkillsInquiry(id) {
    return this.request(`/api/admin/future-skills/inquiries/${id}`);
  }

  async updateFutureSkillsInquiry(id, data) {
    return this.request(`/api/admin/future-skills/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFutureSkillsInquiry(id) {
    return this.request(`/api/admin/future-skills/inquiries/${id}`, {
      method: 'DELETE',
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

  // --- Blog Posts ---
  async getBlogPosts(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/blogs${qs ? `?${qs}` : ''}`);
  }

  async getBlogPost(id) {
    return this.request(`/api/admin/blogs/${id}`);
  }

  async createBlogPost(data) {
    return this.request('/api/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlogPost(id, data) {
    return this.request(`/api/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBlogPost(id) {
    return this.request(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  async publishBlogPost(id) {
    return this.request(`/api/admin/blogs/${id}/publish`, {
      method: 'POST',
    });
  }

  async archiveBlogPost(id) {
    return this.request(`/api/admin/blogs/${id}/archive`, {
      method: 'POST',
    });
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

  // --- Batches ---
  async getBatches(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/batches${qs ? `?${qs}` : ''}`);
  }

  async createBatch(data) {
    return this.request('/api/admin/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBatch(id, data) {
    return this.request(`/api/admin/batches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBatch(id) {
    return this.request(`/api/admin/batches/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Students ---
  async getStudents(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/students${qs ? `?${qs}` : ''}`);
  }

  async getStudent(id) {
    return this.request(`/api/admin/students/${id}`);
  }

  async createStudent(data) {
    return this.request('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id, data) {
    return this.request(`/api/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id) {
    return this.request(`/api/admin/students/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Quizzes ---
  async getQuizzes(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/quizzes${qs ? `?${qs}` : ''}`);
  }

  async getQuiz(id) {
    return this.request(`/api/admin/quizzes/${id}`);
  }

  async createQuiz(data) {
    return this.request('/api/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuiz(id, data) {
    return this.request(`/api/admin/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuiz(id) {
    return this.request(`/api/admin/quizzes/${id}`, {
      method: 'DELETE',
    });
  }

  async getQuizQuestions(quizId) {
    return this.request(`/api/admin/quizzes/${quizId}/questions`);
  }

  async createQuizQuestion(quizId, data) {
    return this.request(`/api/admin/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateQuizQuestion(questionId, data) {
    return this.request(`/api/admin/quizzes/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteQuizQuestion(questionId) {
    return this.request(`/api/admin/quizzes/questions/${questionId}`, {
      method: 'DELETE',
    });
  }

  async getQuizAttempts(quizId, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/quizzes/${quizId}/attempts${qs ? `?${qs}` : ''}`);
  }

  // --- Certificates ---
  async getCertificates(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/certificates${qs ? `?${qs}` : ''}`);
  }

  async getCertificate(id) {
    return this.request(`/api/admin/certificates/${id}`);
  }

  async createCertificate(data) {
    return this.request('/api/admin/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCertificate(id, data) {
    return this.request(`/api/admin/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCertificate(id) {
    return this.request(`/api/admin/certificates/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Payments / Revenue ---
  async getPayments(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/revenue/payments${qs ? `?${qs}` : ''}`);
  }

  async getRevenueSummary() {
    return this.request('/api/admin/revenue/summary');
  }

  async exportPayments() {
    const url = `${getApiBaseUrl()}/api/admin/revenue/payments/export`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'text/csv' },
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || 'Failed to export payments');
    }

    const text = await response.text();
    return { data: text };
  }

  async createRefund(registrationId, amount, reason) {
    return this.request('/api/payments/refund', {
      method: 'POST',
      body: JSON.stringify({ registrationId, amount, reason }),
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

  // --- SEO Entries ---
  async getSeoEntries() {
    return this.request('/api/admin/seo');
  }

  async getSeoEntry(id) {
    return this.request(`/api/admin/seo/${id}`);
  }

  async createSeoEntry(data) {
    return this.request('/api/admin/seo', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSeoEntry(id, data) {
    return this.request(`/api/admin/seo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSeoEntry(id) {
    return this.request(`/api/admin/seo/${id}`, {
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

  // --- Media ---
  // `params` may include: page, limit, q, folder
  async getMedia(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/media${qs ? `?${qs}` : ''}`);
  }

  // formData should be a FormData instance for multipart upload
  async uploadMedia(formData) {
    const headers = {}; // Do not set content-type; browser will set boundary
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const response = await fetch(`${getApiBaseUrl()}/api/admin/media/upload`, {
      method: 'POST',
      body: formData,
      headers,
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await response.json() : { message: await response.text() };

    if (!response.ok) throw new Error(result.message || 'Upload failed');
    return result;
  }

  async updateMedia(id, data) {
    return this.request(`/api/admin/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMedia(id) {
    return this.request(`/api/admin/media/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Internships ---
  async getInternshipApplications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/api/admin/internships${qs ? `?${qs}` : ''}`);
  }

  async createInternshipApplication(data) {
    return this.request('/api/admin/internships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInternshipApplication(id) {
    if (!id || id === 'new') {
      return { success: false, data: null };
    }
    return this.request(`/api/admin/internships/${id}`);
  }

  async updateInternshipApplication(id, data) {
    return this.request(`/api/admin/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInternshipApplication(id) {
    return this.request(`/api/admin/internships/${id}`, {
      method: 'DELETE',
    });
  }

  async addInternshipNote(applicationId, data) {
    return this.request(`/api/admin/internships/${applicationId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInternshipNotes(applicationId) {
    if (!applicationId || applicationId === 'new') {
      return [];
    }
    return this.request(`/api/admin/internships/${applicationId}/notes`);
  }

  async updateInternshipNote(applicationId, noteId, data) {
    return this.request(`/api/admin/internships/${applicationId}/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInternshipNote(applicationId, noteId) {
    return this.request(`/api/admin/internships/${applicationId}/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async getInternshipHistory(applicationId) {
    if (!applicationId || applicationId === 'new') {
      return [];
    }
    return this.request(`/api/admin/internships/${applicationId}/history`);
  }

  // --- Dashboard Metrics ---
  async getDashboardMetrics() {
    return this.request('/api/admin/dashboard/metrics');
  }

  async getDashboardRecentActivity() {
    return this.request('/api/admin/dashboard/recent-activity');
  }

  async getDashboardCharts() {
    return this.request('/api/admin/dashboard/charts');
  }

  async getDashboardSummary() {
    try {
      const [metrics, activity, charts] = await Promise.all([
        this.getDashboardMetrics(),
        this.getDashboardRecentActivity(),
        this.getDashboardCharts(),
      ]);
      return { success: true, data: { metrics: metrics.data, activity, charts: charts.data } };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export const adminApi = new AdminApi();
