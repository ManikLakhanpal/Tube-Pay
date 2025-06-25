import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DollarSign } from "lucide-react";
import { useState } from "react";

export default function SupportCreatorCard() {
  // You can lift state up if you want to handle donation logic in the parent
  const [amount, setAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");

  const handlePreset = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    console.log(amount)
    setAmount(Number(e.target.value));
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[50, 100, 500, 1000].map((val) => (
              <Button
                key={val}
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
          <Button className="w-full" size="lg">
            Send Donation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 