import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface StreamHeaderProps {
  isLive: boolean;
  createdAt: string;
  title: string;
  description?: string;
}

export default function StreamHeader({ isLive, createdAt, title, description }: StreamHeaderProps) {
  return (
    <div className="mb-6">
      <Link href="/streams">
        <Button variant="ghost" className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Streams</span>
        </Button>
      </Link>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {isLive && (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">LIVE</span>
              </>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">{title}</h1>
        {description && <p className="text-gray-600 mb-6">{description}</p>}
      </div>
    </div>
  );
} 