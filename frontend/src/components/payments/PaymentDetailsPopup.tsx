"use client";

import PopupBox from "@/components/ui/PopupBox";
import { User, Calendar, MessageSquare } from "lucide-react";
import { Payment, PaymentType } from "@/types/payments";
import Link from "next/link";

interface PaymentDetailsPopupProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  paymentType: PaymentType;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
  formatAmount: (amount: number) => string;
}

export default function PaymentDetailsPopup({
  payment,
  isOpen,
  onClose,
  paymentType,
  getStatusColor,
  formatDate,
  formatAmount,
}: PaymentDetailsPopupProps) {
  if (!payment) return null;

  return (
    <PopupBox open={isOpen} onClose={onClose}>
      <div className="space-y-6 text-black">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Payment Details</h2>
        </div>
        
        {/* Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Payment ID</p>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{payment.id}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Amount</p>
            <p className="text-lg font-semibold text-green-600">{formatAmount(payment.amount)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Date</p>
            <p className="text-sm">{formatDate(payment.createdAt)}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            {paymentType === "received" ? "From" : "To"}
          </h3>
          <div className="flex items-center gap-3">
            {payment.user?.avatarUrl ? (
              <img
                src={payment.user.avatarUrl}
                alt={payment.user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
            <div>
              <Link href={`/profile/${payment.user?.id}`} className="font-medium">
                {payment.user?.name || payment.stream?.streamer?.name}
              </Link>
              <p className="text-sm text-gray-600">
                User ID: {payment.user?.id || payment.stream?.streamer?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Stream Info */}
        {payment.stream && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Stream Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-600">Stream Title</p>
                <p className="text-sm">{payment.stream.title}</p>
              </div>
              {payment.stream.streamLink && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Stream Link</p>
                  <Link
                    href={payment.stream.streamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {payment.stream.streamLink}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message */}
        {payment.message && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Super Chat Message 
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm">{payment.message}</p>
            </div>
          </div>
        )}
      </div>
    </PopupBox>
  );
} 