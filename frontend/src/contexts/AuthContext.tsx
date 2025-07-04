"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  signIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/current`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data[0].status === "verified" && data[1].user) {
          setUser(data[1].user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Robust signIn for JSON-only backend
  const signIn = async () => {
    return new Promise<void>((resolve, reject) => {
      const width = 500;
      const height = 600;

      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        "googleSignIn",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!popup) {
        reject(new Error("Failed to open popup"));
        return;
      }

      const pollAuth = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/current`, {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            if (data[0].status === "verified" && data[1].user) {
              popup.close();
              clearInterval(pollTimer);
              router.push('/auth/callback')
              resolve();
              return;
            }
          }
        } catch (e) {
          console.log(e);
        }
        if (popup.closed) {
          clearInterval(pollTimer);
          reject(new Error("Popup closed by user"));
        }
      };

      const pollTimer: NodeJS.Timeout = setInterval(pollAuth, 200);
    });
  };

  const logout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "DELETE",
          credentials: "include",
        });
        setUser(null);
        window.location.href = "/";
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
