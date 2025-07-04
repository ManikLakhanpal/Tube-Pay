"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { user, checkAuth, loading } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // * 1. Check if user is authenticated
        await checkAuth();

        // * 2. Redirect to home page after successful authentication
        if (!user) {
          router.replace("/signin");
        }

        // * 3. Wait and redirect the user
        if (!loading && user?.uid) {
          setTimeout(() => {
            router.push(`/profile/${user.uid}`);
          }, 4000);
        }

      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/signin");
      }
    };

    handleCallback();
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
