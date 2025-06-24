export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'STREAMER' | 'USER';
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
}

export interface AuthUser {
  displayName: string;
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  uid: string;
} 