import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Image from "next/image";
import { Video } from "lucide-react";
import Link from "next/link";

interface LiveStreamCardProps {
  streamLink?: string | null;
}

export default function LiveStreamCard({ streamLink }: LiveStreamCardProps) {
  // Function to extract YouTube video ID from various YouTube URL formats
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    // Match patterns like:
    // - youtube.com/watch?v=VIDEO_ID
    // - youtu.be/VIDEO_ID
    // - youtube.com/embed/VIDEO_ID
    // - youtube.com/v/VIDEO_ID
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const videoId = streamLink ? getYouTubeVideoId(streamLink) : null;
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stream</CardTitle>
      </CardHeader>
      <CardContent>
        {!streamLink && (
          <div className="text-center py-8">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No stream link available</p>
          </div>
        )}
        {streamLink && (
          <div className="space-y-4">
            {thumbnailUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={thumbnailUrl}
                  alt="Stream thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black/60 hover:bg-black/90 transition-opacity 
                  duration-300 text-white px-4 py-2 rounded-lg hover:cursor-pointer">
                    <Link href={streamLink} target="_blank" rel="noopener noreferrer">
                      Watch on YouTube
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 