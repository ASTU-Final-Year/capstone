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
    getCities: (regionId, params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/regions/${regionId}/cities${queryString}`);
    },

    // Get schools in region
    getSchools: (regionId, params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/regions/${regionId}/schools${queryString}`);
    },

    // Get students in region
    getStudents: (regionId, filters) =>
      this.#request(`/regions/${regionId}/students${filters ? `?${new URLSearchParams(filters).toString()}` : ""}`),

    // Get university placements for region
    getUniversityPlacements: (regionId, academicYear) =>
      this.#request(`/regions/${regionId}/placements${academicYear ? `?academicYear=${academicYear}` : ""}`),
  };

  // City Admin API Methods
  city = {
    // Get city details
    getCityDetails: (cityId) => this.#request(`/cities/${cityId}`),

    // Get city statistics
    getCityStats: (cityId, academicYear) => {
      const queryString = academicYear ? `?academicYear=${academicYear}` : '';
      return this.#request(`/cities/${cityId}/stats${queryString}`);
    },

    // Manage schools in city
    getSchools: (cityId, params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/cities/${cityId}/schools${queryString}`);
    },

    createSchool: (cityId, data) =>
      this.#request(`/cities/${cityId}/schools`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateSchool: (cityId, schoolId, data) =>
      this.#request(`/cities/${cityId}/schools/${schoolId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    deleteSchool: (cityId, schoolId) =>
      this.#request(`/cities/${cityId}/schools/${schoolId}`, {
        method: 'DELETE',
      }),

    // Get students in city
    getStudents: (cityId, params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/cities/${cityId}/students${queryString}`);
    },

    // Get student submissions in city
    getSubmissions: (cityId, params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/cities/${cityId}/submissions${queryString}`);
    },

    // Get school details
    getSchoolDetails: (cityId, schoolId) =>
      this.#request(`/cities/${cityId}/schools/${schoolId}`),
    getCityAdmins: () =>
      this.#request('/super-admin/admins/city_admin'),

    // Create city admin (already exists as createAdmin)
    // createCityAdmin is just an alias for createAdmin with city_admin role
    createCityAdmin: (data) =>
      this.#request('/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify({ ...data, role: 'city_admin' }),
      }),

    // Get cities for assigning admins
    getCitiesForAdmin: () =>
      this.#request('/super-admin/admins/targets/city_admin'),

    // Delete/remove city admin
    removeCityAdmin: (adminId, userId) =>
      this.#request(`/super-admin/admins/${adminId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      }),
  };

  // Admin methods
  admin = {
    // Get admin by user ID
    getAdminByUserId: (userId) => this.#request(`/admins/user/${userId}`),

    // Get all admin users
    getAllAdminUsers: (params) => {
      console.log("----", params);
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return this.#request(`/admins/users${queryString}`);
    },

    // Get admins by role and target
    getAdminsByRoleAndTarget: (role, targetId) =>
      this.#request(`/admins/${role}/${targetId}`),

    // Get admins by role
    getAdminsByRole: (role) =>
      this.#request(`/admins/${role}`),

    // Update admin user
    updateAdminUser: (userId, data) =>
      this.#request(`/admins/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    // Assign region to admin
    assignRegionToAdmin: (userId, regionId) =>
      this.#request(`/admins/user/${userId}/regions`, {
        method: 'POST',
        body: JSON.stringify({ regionId }),
      }),

    // Remove region from admin
    removeRegionFromAdmin: (userId, regionId) =>
      this.#request(`/admins/user/${userId}/regions/${regionId}`, {
        method: 'DELETE',
      }),

    // Get school admins
    getSchoolAdmins: () => this.#request('/admins/school_admin'),
  };

  student = {
    getProfile: async () => {
      const response = await fetch('/api/student/profile', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch student profile');
      return response.json();
    },

    getAvailableUniversities: async () => {
      const response = await fetch('/api/student/universities', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch universities');
      return response.json();
    },

    getPlacementStatus: async () => {
      const response = await fetch('/api/student/placement-status', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch placement status');
      return response.json();
    },

    savePreferences: async (preferences) => {
      const response = await fetch('/api/student/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ preferences }),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      return response.json();
    },

    submitPreferences: async (academicYear = "2024") => {
      const response = await fetch('/api/student/submit-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ academicYear }),
      });
      if (!response.ok) throw new Error('Failed to submit preferences');
      return response.json();
    },

    updateProfile: async (updates) => {
      const response = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },

    verifyData: async () => {
      const response = await fetch('/api/student/verify', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to verify data');
      return response.json();
    },

    getDashboard: async () => {
      const response = await fetch('/api/student/dashboard', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      return response.json();
    },

    getSubmissions: async () => {
      const response = await fetch('/api/student/submissions', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },
  }

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

  // Utility methods for the dashboard
  utils = {
    // Check if user has permission to access city
    checkCityAccess: async (userId) => {
      try {
        const adminDetails = await this.admin.getAdminByUserId(userId);
        if (!adminDetails || !adminDetails.user || !adminDetails.user.admin || !adminDetails.user.admin.targetId) {
          return null;
        }
        return adminDetails.user.admin.targetId;
      } catch (error) {
        console.error('Error checking city access:', error);
        return null;
      }
    },

    // Check if user has permission to access region
    checkRegionAccess: async (userId) => {
      try {
        const adminDetails = await this.admin.getAdminByUserId(userId);
        if (!adminDetails || !adminDetails.user || !adminDetails.user.admin || !adminDetails.user.admin.targetId) {
          return null;
        }
        return adminDetails.user.admin.targetId;
      } catch (error) {
        console.error('Error checking region access:', error);
        return null;
      }
    },

    // Get current user's role and target
    getCurrentUserRoleAndTarget: async () => {
      try {
        const session = await this.auth.getCurrentSession();
        if (!session.success || !session.session || !session.session.user) {
          return null;
        }

        const user = session.session.user;
        const adminDetails = await this.admin.getAdminByUserId(user.id);

        return {
          user,
          admin: adminDetails?.user?.admin,
          targetId: adminDetails?.user?.admin?.targetId,
        };
      } catch (error) {
        console.error('Error getting user role and target:', error);
        return null;
      }
    },
  };
}

export const api = new ApiClient();