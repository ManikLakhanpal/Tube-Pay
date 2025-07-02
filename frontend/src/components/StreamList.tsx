"use client";

import { Button } from "@/components/ui/Button";
import { Eye, Video } from "lucide-react";
import { Stream, User } from "@/types";
import { useRouter } from "next/navigation";

interface StreamListProps {
  streams: User["streams"];
}

export default function StreamList({ streams }: StreamListProps) {
  const router = useRouter();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 text-black">Streams</h2>
      {streams && streams.length > 0 ? (
        <div className="space-y-4">
          {streams.map((stream: Stream) => (
            <div
              key={stream.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {stream.isLive && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-red-600">
                        LIVE
                      </span>
                    </div>
                  )}

                  <h3
                    className="text-lg font-semibold text-black cursor-pointer hover:underline"
                    onClick={() => router.push(`/streams/${stream.id}`)}
                  >
                    {stream.title}
                  </h3>
                  <p
                    className="text-gray-600 text-sm mb-1 line-clamp-2 cursor-pointer"
                    onClick={() => router.push(`/streams/${stream.id}`)}
                  >
                    {stream.description}
                  </p>
                  <div className="flex space-x-2 rounded-md mt-2">
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
                    <Button
                      className="w-full flex-1"
                      onClick={() => router.push(`/streams/${stream.id}`)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 text-right sm:mt-3">
                    {stream.createdAt && (
                      <span>{new Date(stream.createdAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-fit"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">No streams yet.</div>
      )}
    </div>
  );
}
