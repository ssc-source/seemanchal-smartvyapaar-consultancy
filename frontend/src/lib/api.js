/**
 * Centralized API configuration for the frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  /**
   * Submit a new inquiry
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async submitInquiry(data) {
    const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.errors?.[0]?.msg || "Failed to submit inquiry");
    }
    return result;
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
  }
};
