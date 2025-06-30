import { User, Stream, Order, Payment } from '@/types';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ! Auth API
export const authAPI = {
  googleLogin: () => `${API_BASE_URL}/api/auth/google`,
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.ok;
  },
};

// ! User API
export const userAPI = {
  getProfile: async (id: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
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

// ! Stream API
export const streamAPI = {
  getLiveStreams: async (): Promise<Stream[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/streams/live`, {
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
      const response = await fetch(`${API_BASE_URL}/api/streams/${id}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/streams`, {
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

  updateStream: async (id: string, data: { title?: string; description?: string; streamLink?: string; isLive?: string }): Promise<Stream | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/streams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          streamLink: data.streamLink,
          isLive: data.isLive,
        }),
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
      const response = await fetch(`${API_BASE_URL}/api/streams/${id}`, {
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

// ! Payment API
export const paymentAPI = {
  createOrder: async (data: { amount: number; message?: string; streamId: string }): Promise<Order | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/order`, {
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
      console.error('Error creating payment order:', error);
      return null;
    }
  },

  verifyPayment: async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<Payment | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
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
      console.error('Error verifying payment:', error);
      return null;
    }
  },
}; 

