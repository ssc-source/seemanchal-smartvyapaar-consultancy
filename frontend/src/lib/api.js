/**
 * Centralized API configuration for the frontend
 * PRODUCTION-HARDENED: Timeout, abort signal, better errors, comprehensive logs
 */

const _RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const sanitizeApiBaseUrl = (raw) => {
  const trimmed = raw.trim().replace(/\/$/, '');
  const base = trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
  return base;
};
const API_BASE_URL = sanitizeApiBaseUrl(_RAW_API_URL);
// Export sanitized base so pages can reuse the same canonical base URL
export { API_BASE_URL };
const FETCH_TIMEOUT = 30000; // 30 seconds

/**
 * Defensive fetch wrapper with configurable timeouts by request type
 * @param {string} url 
 * @param {Object} options 
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options = {}) => {
  const isMutation = options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH' || options.method === 'DELETE';
  const defaultTimeout = isMutation ? 30000 : 5000;
  const timeoutMs = options.timeout !== undefined ? options.timeout : defaultTimeout;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const fetchOptions = { ...options };
  delete fetchOptions.timeout;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
};

if (typeof window !== 'undefined') {
  // console.log('═══════════════════════════════════════════════════════════');
  // console.log('🟦 [API] Frontend API Client Initialized');
  // console.log('═══════════════════════════════════════════════════════════');
  // console.log('API_BASE_URL:', API_BASE_URL);
  // console.log('FETCH_TIMEOUT:', FETCH_TIMEOUT + 'ms');
  // console.log('ENV Variable NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  // console.log('═══════════════════════════════════════════════════════════');
}

export const api = {
  /**
   * Submit a new inquiry with comprehensive error handling
   * @param {Object} data - Form data
   * @returns {Promise<Object>}
   */
  async submitInquiry(data) {
    const url = `${API_BASE_URL}/api/inquiries`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    console.log('\n' + '█'.repeat(60));
    console.log('🟦 [API.submitInquiry] STARTING INQUIRY SUBMISSION');
    console.log('█'.repeat(60));
    console.log({
      url,
      method: 'POST',
      dataKeys: Object.keys(data),
      timestamp: new Date().toISOString()
    });

    try {
      console.log('🟦 [API] Sending fetch request with 30s timeout...');
      
      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('🟦 [API.submitInquiry] Response received', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        contentType: response.headers.get('content-type')
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.error('🟥 [API] Failed to parse JSON:', jsonErr);
        throw new Error(`Invalid JSON from server: ${response.statusText}`);
      }
      
      if (!response.ok) {
        console.error('🟥 [API.submitInquiry] Error response:', { status: response.status, result });
        const msg = result.message || result.errors?.[0]?.msg || `Server error: ${response.statusText}`;
        throw new Error(msg);
      }

      console.log('✅ [API.submitInquiry] SUCCESS!', { success: result.success, leadId: result.leadId });
      console.log('█'.repeat(60) + '\n');
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('🟥 [API] Request timed out after ' + FETCH_TIMEOUT + 'ms');
        throw new Error('Server request timed out. Please try again.');
      }
      
      console.error('🟥 [API.submitInquiry] EXCEPTION', {
        name: error.name,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      console.log('█'.repeat(60) + '\n');
      throw error;
    }
  },

  /**
   * Fetch all services
   * @returns {Promise<Object>}
   */
  async getServices() {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/services`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch services");
    return result;
  },

  /**
   * Fetch all projects
   * @returns {Promise<Object>}
   */
  async getProjects() {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch projects");
    return result;
  },

  async submitCareerApplication(data) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[API.submitCareerApplication] This legacy helper is deprecated; use /api/internships/apply via the internship flow.');
  }
  const response = await fetch(
    `${API_BASE_URL}/api/internships/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application");
  }

  return result;
},

async submitCommunityApplication(data) {

  const response = await fetch(
    `${API_BASE_URL}/api/community-applications`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to submit community application"
    );
  }

  return result;
},

// ==================== FUTURE SKILLS LAB ====================

/**
 * Submit Future Skills Lab school inquiry
 * @param {Object} data - Inquiry form data
 * @returns {Promise<Object>}
 */
async submitFutureSkillsInquiry(data) {
  const url = `${API_BASE_URL}/api/future-skills/inquiry`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  console.log('🟦 [API.submitFutureSkillsInquiry] Starting submission...', {
    schoolName: data.schoolName,
    email: data.email
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      const msg = result.message || result.errors?.[0]?.msg || 'Failed to submit inquiry';
      throw new Error(msg);
    }

    console.log('✅ [API.submitFutureSkillsInquiry] SUCCESS', { inquiryId: result.inquiryId });
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('🟥 [API.submitFutureSkillsInquiry] Error:', error.message);
    throw error;
  }
},

/**
 * Submit school details to generate and download a partnership proposal PDF
 * @param {Object} data - Proposal form data
 * @returns {Promise<Blob>}
 */
async submitFutureSkillsProposal(data) {
  const url = `${API_BASE_URL}/api/future-skills/proposal`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  console.log('🟦 [API.submitFutureSkillsProposal] Starting proposal generation...', {
    schoolName: data.schoolName,
    email: data.email
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = 'Failed to generate proposal';
      try {
        const result = await response.json();
        errorMsg = result.message || result.errors?.[0]?.msg || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const blob = await response.blob();
    console.log('✅ [API.submitFutureSkillsProposal] SUCCESS', { size: blob.size });
    return blob;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('🟥 [API.submitFutureSkillsProposal] Error:', error.message);
    throw error;
  }
},

/**
 * Get all Future Skills Lab FAQs
 * @returns {Promise<Object>}
 */
async getFutureSkillsFAQs() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/future-skills/faqs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch FAQs");
  return result;
},

/**
 * Get all Future Skills Lab programs
 * @returns {Promise<Object>}
 */
async getFutureSkillsPrograms() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/future-skills/programs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch programs");
  return result;
},

/**
 * Get all Future Skills Lab workshops
 * @returns {Promise<Object>}
 */
async getFutureSkillsWorkshops() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/future-skills/workshops`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch workshops");
  return result;
},

/**
 * Get all Future Skills Lab testimonials
 * @returns {Promise<Object>}
 */
async getFutureSkillsTestimonials() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/future-skills/testimonials?published=true`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch testimonials");
  return result;
},

/**
 * Get all Future Skills Lab success stories
 * @returns {Promise<Object>}
 */
async getFutureSkillsSuccessStories() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/future-skills/success-stories?published=true`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Failed to fetch success stories");
    return result;
  },
};
