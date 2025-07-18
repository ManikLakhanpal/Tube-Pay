"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

// * Components
import PaymentFilters from "@/components/payments/PaymentFilters";
import PaymentTable from "@/components/payments/PaymentTable";
import PaymentCards from "@/components/payments/PaymentCards";
import PaymentPagination from "@/components/payments/PaymentPagination";
import PaymentDetailsPopup from "@/components/payments/PaymentDetailsPopup";

// * Types and Utils
import {
  Payment,
  PaymentResponse,
  PaymentType,
  PaymentStatus,
} from "@/types/payments";
import { getStatusColor, formatDate, formatAmount } from "@/lib/paymentUtils";
import { paymentAPI } from "@/lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // * Filters
  const [paymentType, setPaymentType] = useState<PaymentType>("received");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { user } = useAuth();
  const router = useRouter();

  const fetchPayments = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      let data: PaymentResponse;
      
      if (paymentType === "sent") {
        const response = await paymentAPI.getSentPayments(currentPage, itemsPerPage, statusFilter);
        data = response;
      } else {
        const response = await paymentAPI.getReceivedPayments(currentPage, itemsPerPage, statusFilter);
        data = response;
      }

      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  }, [paymentType, statusFilter, currentPage, itemsPerPage, user?.uid]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to view payments.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-black">Payments</h1>
          </div>
          <p className="text-gray-600">Manage and track your payment history</p>
          <p className="text-gray-600">
            <span className="font-bold">Note:</span> Payments are processed
            within 24 hours.
          </p>
        </div>

        {/* Filters */}
        <PaymentFilters
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment History 🤑</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No payments found.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <PaymentTable
                  payments={payments}
                  paymentType={paymentType}
                  onPaymentClick={handlePaymentClick}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                />

                {/* Mobile Cards */}
                <PaymentCards
                  payments={payments}
                  onPaymentClick={handlePaymentClick}
                  getStatusColor={getStatusColor}
                  formatDate={formatDate}
                  formatAmount={formatAmount}
                />

                {/* Pagination */}
                {pagination && (
                  <PaymentPagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Details Popup */}
        <PaymentDetailsPopup
          payment={selectedPayment}
          isOpen={showPaymentDetails}
          onClose={() => setShowPaymentDetails(false)}
          paymentType={paymentType}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          formatAmount={formatAmount}
        />
      </div>
    </div>
  );
}
