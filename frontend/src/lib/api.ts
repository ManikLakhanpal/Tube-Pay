import { User, Stream, Payment } from '@/types';
import { API_BASE_URL } from './utils';

// Auth API
export const authAPI = {
  googleLogin: () => `${API_BASE_URL}/auth/google`,
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.ok;
  },
};

// User API
export const userAPI = {
  getProfile: async (id: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  updateProfile: async (data: { name?: string; avatarUrl?: string; role?: string }): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  },
};

// Stream API
export const streamAPI = {
  getLiveStreams: async (): Promise<Stream[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streams/live`, {
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return [];
    }
  },

  getStreamById: async (id: string): Promise<Stream | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streams/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error fetching stream:', error);
      return null;
    }
  },

  createStream: async (data: { title: string; description?: string; streamLink?: string }): Promise<Stream | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error creating stream:', error);
      return null;
    }
  },

  updateStream: async (id: string, data: { title?: string; description?: string; streamLink?: string; isLive?: boolean }): Promise<Stream | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) return null;
      return response.json();
    } catch (error) {
      console.error('Error updating stream:', error);
      return null;
    }
  },

  deleteStream: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/streams/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting stream:', error);
      return false;
    }
  },
}; 