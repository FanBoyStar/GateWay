import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  organization_id: string | null;
  onboarding_completed: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  completeOnboarding: (organizationName: string, website?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create user');

      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });

      if (profileError) throw profileError;

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const completeOnboarding = async (
    organizationName: string,
    website?: string
  ): Promise<{ error: string | null }> => {
    try {
      if (!session?.user.id) throw new Error('No authenticated user');

      let organizationId = user?.organization_id;

      if (organizationName) {
        const { data, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: organizationName,
            website: website || null,
            created_by: session.user.id,
          })
          .select('id')
          .maybeSingle();

        if (orgError) throw orgError;
        if (!data) throw new Error('Failed to create organization');

        organizationId = data.id;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          organization_id: organizationId || null,
          onboarding_completed: true,
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      await fetchUserProfile(session.user.id);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Onboarding failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, completeOnboarding }}>
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
