'use client';

import { useEffect } from 'react';

export default function SuperChatOverlay() {
  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_API_URL}/api/payments/superchat`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const notif = document.getElementById("notification");
      if (!notif) return;

      notif.innerText = `💸 ${data.username} donated ₹${data.amount}: ${data.message}`;
      notif.style.display = "block";

      // Restart animation
      notif.classList.remove("animate");
      void notif.offsetWidth;
      notif.classList.add("animate");

      setTimeout(() => {
        notif.style.display = "none";
      }, 5000);
    };

    return () => socket.close();
  }, []);

  return (
    <div
      id="notification"
      className="fixed bottom-[10%] left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl text-white text-2xl"
      style={{
        display: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        animation: 'fadeInOut 5s ease-in-out',
      }}
    >
      Super Chat Received!
      <style>
        {`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(50px) scale(0.9); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-50px) scale(0.9); }
        }
        .animate {
          animation: fadeInOut 5s ease-in-out;
        }
        `}
      </style>
    </div>
  );
}