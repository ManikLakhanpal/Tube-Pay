"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Filter } from "lucide-react";

type PaymentType = "sent" | "received";
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "all";

interface PaymentFiltersProps {
  paymentType: PaymentType;
  setPaymentType: (type: PaymentType) => void;
  statusFilter: PaymentStatus;
  setStatusFilter: (status: PaymentStatus) => void;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
}

export default function PaymentFilters({
  paymentType,
  setPaymentType,
  statusFilter,
  setStatusFilter,
  itemsPerPage,
  setItemsPerPage,
}: PaymentFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Payment Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setPaymentType("received")}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  paymentType === "received"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setPaymentType("sent")}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  paymentType === "sent"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sent
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus)}
              className="px-3 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 