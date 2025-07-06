import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { Payment } from "@/types";

interface RecentSupportCardProps {
  payments?: Payment[];
}

export default function RecentSupportCard({ payments }: RecentSupportCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.slice(0, 4).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {payment.user?.avatarUrl ? (
                      <Image
                        src={payment.user.avatarUrl}
                        alt={payment.user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-black">
                      {payment.user?.name || "Anonymous"}
                    </div>
                    {payment.message && (
                      <div className="text-gray-700 text-sm">
                        {payment.message}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-green-600 text-lg">
                    ₹{payment.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">No donations yet</p>
              <p className="text-xs text-gray-500">Be the first to support!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 