import { Button } from "@/components/ui/Button";
import { Eye, Video, Calendar, User as UserIcon } from "lucide-react";
import { Stream, User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from "next/link";

interface StreamListProps {
  streams: User["streams"];
}

interface StreamCardProps {
  stream: Stream;
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card key={stream.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-600">LIVE</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{stream.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {stream.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          {stream.streamer?.name && (
            <div className="flex items-center space-x-1">
              <UserIcon className="h-4 w-4" />
              <span>{stream.streamer.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(stream.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          {stream.streamLink && (
            <a
              href={stream.streamLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Watch Stream
              </Button>
            </a>
          )}
          <Link href={`/streams/${stream.id}`} className="flex-1">
            <Button className="w-full">
              <Video className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StreamList({ streams }: StreamListProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-black">Streams</h2>
      {streams && streams.length > 0 ? (
        <div className="space-y-4">
          {streams.map((stream: Stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No streams yet.</div>
      )}
    </div>
  );
}
