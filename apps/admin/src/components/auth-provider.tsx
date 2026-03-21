"use client";

import { Hub } from "aws-amplify/utils";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { fetchAuthSession, signInWithRedirect, signOut } from "@/lib/auth";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await fetchAuthSession();
        setIsAuthenticated(!!session.tokens?.accessToken);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        checkAuth();
      }
      if (payload.event === "signedOut") {
        setIsAuthenticated(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      signIn: () => signInWithRedirect(),
      signOut: () => signOut(),
    }),
    [isAuthenticated, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
