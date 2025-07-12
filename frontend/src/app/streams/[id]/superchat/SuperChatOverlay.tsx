'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';

interface SuperChatMessage {
  username: string;
  amount: number;
  message: string;
  streamId: string;
}

export default function SuperChatOverlay() {
  const [superChat, setSuperChat] = useState<SuperChatMessage | null>(null);
  const params = useParams();
  const streamId = params?.id as string;

  useEffect(() => {
    // Make sure to use your backend's websocket URL and port
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });

    // Join the stream room
    socket.emit('join_stream', streamId);

    // Listen for superchat events
    socket.on('superchat', (data: SuperChatMessage) => {
      setSuperChat(data);
      setTimeout(() => setSuperChat(null), 10000);
    });

    return () => {
      socket.disconnect();
    };
  }, [streamId]);

  return (
    <div
      id="notification"
      className={`fixed bottom-[10%] left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl text-white text-2xl transition-all duration-500 ${
        superChat ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {superChat
        ? `💸 ${superChat.username} donated ₹${superChat.amount}: ${superChat.message}`
        : 'Super Chat Received!'}
    </div>
  );
}