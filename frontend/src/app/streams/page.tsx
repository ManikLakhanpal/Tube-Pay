'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { streamAPI } from '@/lib/api';
import { Stream } from '@/types';
import { Video } from 'lucide-react';
import { StreamCard } from '@/components/StreamList';

export default function StreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const liveStreams = await streamAPI.getLiveStreams();
        setStreams(liveStreams);
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading streams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Live Streams</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and support your favorite content creators with real-time donations and interactions.
          </p>
        </div>

        {streams.length === 0 ? (
          <div className="text-center py-12">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No live streams</h3>
            <p className="text-gray-600 mb-6">
              There are currently no live streams. Check back later!
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 