/**
 * Centralized API configuration for the frontend
 * PRODUCTION-HARDENED: Timeout, abort signal, better errors, comprehensive logs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FETCH_TIMEOUT = 30000; // 30 seconds

if (typeof window !== 'undefined') {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🟦 [API] Frontend API Client Initialized');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('FETCH_TIMEOUT:', FETCH_TIMEOUT + 'ms');
  console.log('ENV Variable NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('═══════════════════════════════════════════════════════════');
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
    const response = await fetch(`${API_BASE_URL}/api/services`, {
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
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch projects");
    return result;
  },

  async submitCareerApplication(data) {
  const response = await fetch(
    `${API_BASE_URL}/api/career-applications`,
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

};
