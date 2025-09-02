import axios from "axios";

const API_BASE_URL = "http://localhost:5003/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Types based on API documentation
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  user_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  created_at?: string;
  is_active?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface GoogleSignInData {
  idToken: string;
}

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  // Google Sign-in
  googleSignIn: async (data: GoogleSignInData): Promise<AuthResponse> => {
    const response = await api.post("/auth/google-signin", data);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<AuthResponse> => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Deactivate account
  deactivate: async (): Promise<{ message: string }> => {
    const response = await api.put("/auth/deactivate");
    return response.data;
  },

  // Delete account
  deleteAccount: async (data: {
    password: string;
  }): Promise<{ message: string }> => {
    const response = await api.delete("/auth/delete-account", { data });
    return response.data;
  },
};

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login page here
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
