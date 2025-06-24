'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data[0].status === 'verified' && data[1].user) {
          setUser(data[1].user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 