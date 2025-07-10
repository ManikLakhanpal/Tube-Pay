import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SuperChat Overlay",
  description: "Live donation overlay for OBS",
};

export default function SuperChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent">
        <div className="w-screen h-screen bg-transparent">
          {children}
        </div>
      </body>
    </html>
  );
} 