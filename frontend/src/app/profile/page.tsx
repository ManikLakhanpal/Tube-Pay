"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // * 1. Check if the user exists, otherwise ask them to signIn
    if (!user) {
      router.replace("/signin");
    }
    // * 2. Check if loading was complete and user is there.
    if (!loading && user?.uid) {
      router.replace(`/profile/${user.uid}`);
    }
  }, [user, loading, router]);

  return null;
} 