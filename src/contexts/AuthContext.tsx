import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  organization_id: string | null;
  onboarding_completed: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => void;
  completeOnboarding: (organizationName: string, website?: string, brandColor?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/user', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signOut = () => {
    window.location.href = '/api/logout';
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
    <AuthContext.Provider value={{ user, loading, signOut, completeOnboarding }}>
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
