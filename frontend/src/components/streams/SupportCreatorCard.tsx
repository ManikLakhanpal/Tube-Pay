import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { paymentAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface SupportCreatorCardProps {
  streamId: string;
  onPaymentSuccess?: () => void;
}

export default function SupportCreatorCard({ streamId, onPaymentSuccess }: SupportCreatorCardProps) {
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user: authUser } = useAuth();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handlePreset = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setAmount(Number(e.target.value) || 0);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authUser) {
      setPaymentStatus("Please sign in to make a donation.");
      return;
    }

    if (amount <= 0) {
      setPaymentStatus("Please enter a valid amount.");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Create order
      const orderData = {
        amount: amount,
        message: message || undefined,
        streamId: streamId,
      };

      const orderResponse = await paymentAPI.createOrder(orderData);
      
      if (!orderResponse) {
        setPaymentStatus("Failed to create payment order. Please try again.");
        return;
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add this to your .env.local
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.id,
        name: "TubePay",
        description: "Support Creator",
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse?.status === "SUCCESS") {
              setPaymentStatus("Payment successful! Thank you for your support.");
              setAmount(0);
              setCustomAmount("");
              setMessage("");
              onPaymentSuccess?.();
            } else {
              setPaymentStatus("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: authUser.displayName,
          email: authUser.emails?.[0]?.value || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);

      rzp1.on("payment.failed", function (response: any) {
        setPaymentStatus("Payment failed. Please try again.");
        console.error("Payment failed:", response);
      });

      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      setPaymentStatus("Failed to create payment order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card id="support">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Support This Creator</span>
        </CardTitle>
        <CardDescription>
          Show your appreciation by sending a donation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[50, 100, 500, 1000].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                className="h-16 text-lg"
                onClick={() => handlePreset(val)}
              >
                ₹{val}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Custom Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={handleCustomAmount}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Message (Optional)
            </label>
            <textarea
              placeholder="Leave a message for the creator..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isProcessing || amount <= 0}
          >
            {isProcessing ? "Processing..." : `Send Donation ₹${amount}`}
          </Button>
        </form>
        
        {paymentStatus && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            paymentStatus.includes("successful") 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {paymentStatus}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 