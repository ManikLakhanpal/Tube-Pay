import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10  border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">Tube Pay</span>
          <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/about" className="hover:underline underline-offset-4">About</Link>
          <Link href="/streams" className="hover:underline underline-offset-4">Streams</Link>
          <Link href="/profile" className="hover:underline underline-offset-4">Profile</Link>
          <a href="mailto:support@tubepay.com" className="hover:underline underline-offset-4">Contact</a>
        </div>
        <div className="text-xs text-gray-500 text-center md:text-right">
          Made by Manik Lakhanpal
        </div>
      </div>
    </footer>
  );
} 