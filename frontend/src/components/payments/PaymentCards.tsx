"use client";

import { Button } from "@/components/ui/Button";
import { Eye, User } from "lucide-react";
import { Payment } from "@/types/payments";
import Image from "next/image";

interface PaymentCardsProps {
  payments: Payment[];
  onPaymentClick: (payment: Payment) => void;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number) => string;
}

export default function PaymentCards({
  payments,
  onPaymentClick,
  getStatusColor,
  formatDate,
  formatAmount,
}: PaymentCardsProps) {
  return (
    <div className="lg:hidden space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onPaymentClick(payment)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {payment.user?.avatarUrl ? (
                <Image
                  src={payment.user.avatarUrl}
                  alt={payment.user.name}
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {payment.user?.name || payment.stream?.streamer?.name}
                </p>
                <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">{formatAmount(payment.amount)}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate flex-1">
              {payment.stream?.title || "N/A"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPaymentClick(payment);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 