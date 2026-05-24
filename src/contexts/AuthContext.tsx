import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  organization_id: string | null;
  onboarding_completed: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  completeOnboarding: (organizationName: string, website?: string, brandColor?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Sign up failed' };
      setUser(data);
      return { error: null };
    } catch {
      return { error: 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Sign in failed' };
      setUser(data);
      return { error: null };
    } catch {
      return { error: 'Sign in failed' };
    }
  };

  const signOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const completeOnboarding = async (organizationName: string, website?: string, brandColor?: string): Promise<{ error: string | null }> => {
    try {
      const res = await fetch('/api/auth/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ organizationName, website, brandColor }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Onboarding failed' };
      setUser(data);
      return { error: null };
    } catch {
      return { error: 'Onboarding failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, completeOnboarding }}>
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
