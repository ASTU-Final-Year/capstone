const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  #token = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.#token = localStorage.getItem('token');
    }
  }

  setToken(token) {
    this.#token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.#token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async #request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      baseUrl: API_BASE_URL,
    });

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.#token) {
      headers['Authorization'] = `Bearer ${this.#token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      console.log('API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', {
        url,
        error: error.message,
        errorType: error.name,
      });
      throw error;
    }
  }

  // Super Admin API Methods
  superAdmin = {
    // Regions
    getRegions: () => this.#request('/super-admin/regions'),
    createRegion: (data) =>
      this.#request('/super-admin/regions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateRegion: (regionId, data) =>
      this.#request(`/super-admin/regions/${regionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteRegion: (regionId) =>
      this.#request(`/super-admin/regions/${regionId}`, {
        method: 'DELETE',
      }),

    // Universities
    getUniversities: () => this.#request('/super-admin/universities'),
    createUniversity: (data) =>
      this.#request('/super-admin/universities', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateUniversity: (universityId, data) =>
      this.#request(`/super-admin/universities/${universityId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    deleteUniversity: (universityId) =>
      this.#request(`/super-admin/universities/${universityId}`, {
        method: 'DELETE',
      }),

    // Admins
    getAdminsByRole: (role) =>
      this.#request(`/super-admin/admins/${role}`),
    createAdmin: (data) =>
      this.#request('/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    demoteAdmin: (adminId, userId) =>
      this.#request(`/super-admin/admins/${adminId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      }),
    getAdminTargets: (role) =>
      this.#request(`/super-admin/admins/targets/${role}`),

    // Statistics
    getSystemStats: () => this.#request('/super-admin/stats'),
  };
  // Region Admin API Methods
  region = {
    // Get region details
    getRegionDetails: (regionId) => this.#request(`/regions/${regionId}`),

    // Get regional statistics
    getRegionalStats: (regionId) => this.#request(`/regions/${regionId}/stats`),

    // Manage cities
    createCity: (regionId, name, longitude, latitude) =>
      this.#request(`/regions/${regionId}/cities`, {
        method: "POST",
        body: JSON.stringify({ name, longitude, latitude }),
      }),

    updateCity: (cityId, data) =>
      this.#request(`/cities/${cityId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteCity: (cityId) =>
      this.#request(`/cities/${cityId}`, {
        method: "DELETE",
      }),

    // Get cities in region
    getCities: (regionId) => this.#request(`/regions/${regionId}/cities`),

    // Get schools in region
    getSchools: (regionId) => this.#request(`/regions/${regionId}/schools`),

    // Get students in region
    getStudents: (regionId, filters) =>
      this.#request(`/regions/${regionId}/students${filters ? `?${new URLSearchParams(filters).toString()}` : ""}`),

    // Get university placements for region
    getUniversityPlacements: (regionId, academicYear) =>
      this.#request(`/regions/${regionId}/placements${academicYear ? `?academicYear=${academicYear}` : ""}`),
  };

  // Admin methods
  admin = {
    // Get admin by user ID
    getAdminByUserId: (userId) => this.#request(`/admins/user/${userId}`),

    // Get admins by role and target
    getAdminsByRoleAndTarget: (role, targetId) =>
      this.#request(`/admins/${role}/${targetId}`),
  };

  // Auth methods
  auth = {
    login: (email, password) =>
      this.#request('/session', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => this.#request('/session', { method: 'DELETE' }),
    getCurrentSession: () => this.#request('/session'),
  };
}

export const api = new ApiClient();