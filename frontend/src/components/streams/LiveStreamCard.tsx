import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Video } from "lucide-react";

interface LiveStreamCardProps {
  streamLink?: string;
}

export default function LiveStreamCard({ streamLink }: LiveStreamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">
              {streamLink ? (
                <a
                  href={streamLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline"
                >
                  Click here to watch on YouTube
                </a>
              ) : (
                "Stream link not available"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 