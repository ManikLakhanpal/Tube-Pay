"use client";

import { Button } from "@/components/ui/Button";
import { PaginationInfo } from "@/types/payments";

interface PaymentPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function PaymentPagination({
  pagination,
  onPageChange,
}: PaymentPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Page {pagination.currentPage} of {pagination.totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasPrevPage}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 