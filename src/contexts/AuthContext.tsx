import React, { createContext, useContext } from 'react';
import { useAuth as useReplitAuth } from '@/hooks/use-auth';

interface AuthContextType {
  user: {
    id: string;
    email: string | null;
    full_name: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  } | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useReplitAuth();

  const mappedUser = user
    ? {
        id: user.id,
        email: user.email ?? null,
        full_name: user.firstName
          ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
          : null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        profileImageUrl: user.profileImageUrl ?? null,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user: mappedUser,
        loading: isLoading,
        isAuthenticated,
        signOut: logout,
      }}
    >
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
