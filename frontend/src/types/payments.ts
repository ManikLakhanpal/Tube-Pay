export interface Payment {
  id: string;
  amount: number;
  message: string | null;
  createdAt: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  success: boolean;
  user?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  stream?: {
    id: string;
    title: string;
    streamLink: string | null;
    streamer?: {
      id: string;
      name: string;
    };
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaymentResponse {
  payments: Payment[];
  pagination: PaginationInfo;
}

export type PaymentType = "sent" | "received";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "all"; 