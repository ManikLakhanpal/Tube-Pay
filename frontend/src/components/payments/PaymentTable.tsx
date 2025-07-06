"use client";

import { Button } from "@/components/ui/Button";
import { Eye, User } from "lucide-react";
import { Payment } from "@/types/payments";

interface PaymentTableProps {
  payments: Payment[];
  paymentType: "sent" | "received";
  onPaymentClick: (payment: Payment) => void;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number) => string;
}

export default function PaymentTable({
  payments,
  paymentType,
  onPaymentClick,
  getStatusColor,
  formatDate,
  formatAmount,
}: PaymentTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              {paymentType === "received" ? "From" : "To"}
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Stream</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {payment.user?.avatarUrl ? (
                    <img
                      src={payment.user.avatarUrl}
                      alt={payment.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <span className="font-medium">
                    {payment.user?.name || payment.stream?.streamer?.name}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 font-semibold text-green-600">
                {formatAmount(payment.amount)}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {formatDate(payment.createdAt)}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                {payment.stream?.title || "N/A"}
              </td>
              <td className="py-3 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaymentClick(payment)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 