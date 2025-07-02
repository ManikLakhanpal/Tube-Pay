export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "ADMIN" | "STREAMER" | "USER";
  createdAt: string;
  streams: Stream[];
}

export interface Stream {
  id: string;
  title: string;
  description?: string;
  streamLink?: string;
  isLive: boolean;
  streamer: User;
  streamerId: string;
  createdAt: string;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  message?: string;
  user: User;
  userId: string;
  stream: Stream;
  streamId: string;
  createdAt: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  success: boolean;
}

export interface Order {
  id: string;
  amount: number;
  message?: string;
  currency: string;
}

export interface AuthUser {
  displayName: string;
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  uid: string;
}

export interface RazorPayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorPayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorPayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

