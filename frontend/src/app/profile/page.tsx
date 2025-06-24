"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    }

    if (!loading && user?.uid) {
      router.replace(`/profile/${user.uid}`);
    }
  }, [user, loading, router]);

  // Optionally, show a loading spinner or nothing while redirecting
  return null;
} 