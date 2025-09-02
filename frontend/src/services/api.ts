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

// Conversation types
export interface Conversation {
  conversation_id: string;
  user_id: string;
  ai_type: string;
  title?: string;
  created_at: string;
  updated_at: string;
  journal_access_enabled: boolean;
  message_count?: number;
  last_message?: string;
  last_message_at?: string;
}

export interface Message {
  message_id: string;
  conversation_id: string;
  sender: "user" | "ai";
  content: string;
  created_at: string;
  ai_type?: string;
}

export interface CreateConversationData {
  ai_type: string;
  journal_access_enabled?: boolean;
}

export interface SendMessageData {
  content: string;
}

export interface StreamChunk {
  type: "start" | "chunk" | "complete" | "error";
  content?: string;
  accumulated_content?: string;
  timestamp?: string;
  saved?: boolean;
  error?: string;
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

// Conversation API calls
export const conversationAPI = {
  // Get available AI types
  getAITypes: async (): Promise<{ ai_types: any[] }> => {
    const response = await api.get("/conversations/ai-types");
    return response.data;
  },

  // Create new conversation
  createConversation: async (
    data: CreateConversationData
  ): Promise<{ message: string; conversation: Conversation }> => {
    const response = await api.post("/conversations", data);
    return response.data;
  },

  // Get all conversations
  getConversations: async (
    page = 1,
    limit = 10
  ): Promise<{
    conversations: Conversation[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get(
      `/conversations?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get single conversation with messages
  getConversation: async (
    conversationId: string,
    page = 1,
    limit = 50
  ): Promise<{
    conversation: Conversation;
    messages: Message[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const response = await api.get(
      `/conversations/${conversationId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Send message (non-streaming)
  sendMessage: async (
    conversationId: string,
    data: SendMessageData
  ): Promise<{ message: string; streaming: boolean }> => {
    const response = await api.post(
      `/conversations/${conversationId}/messages`,
      data
    );
    return response.data;
  },

  // Create streaming connection
  streamMessage: async (
    conversationId: string,
    message: string,
    onChunk: (chunk: StreamChunk) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              onChunk(data);
            } catch (error) {
              console.error("Error parsing SSE data:", error);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  // Cancel stream
  cancelStream: async (
    conversationId: string
  ): Promise<{ message: string; message_id?: string }> => {
    const response = await api.delete(
      `/conversations/${conversationId}/stream`
    );
    return response.data;
  },

  // Get active streams
  getActiveStreams: async (): Promise<{
    active_streams: any[];
    total_active: number;
  }> => {
    const response = await api.get("/conversations/streams/active");
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (
    conversationId: string
  ): Promise<{ message: string }> => {
    const response = await api.delete(`/conversations/${conversationId}`);
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
