"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { toast } from "react-hot-toast";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  gender?: string;
  is_active?: boolean;
  profile_image?: string;
}

interface AuthContextType {
  user: User | null;
  getToken: () => Promise<string | null>;
  isLoading: boolean;
  logout: () => Promise<void>;
  isSignedIn: boolean | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Get Clerk auth state
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Track previous sign-in state to reload on logout via UserButton
  const wasSignedInRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    // specific check: IF we were signed in, and now we are NOT, then we just logged out.
    if (wasSignedInRef.current === true && !isSignedIn) {
      window.location.reload();
    }

    wasSignedInRef.current = !!isSignedIn;
  }, [isLoaded, isSignedIn]);

  const logout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  // Derive user object directly from Clerk user
  const user: User | null = useMemo(() => {
    return clerkUser
      ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          full_name: clerkUser.fullName || "",
          profile_image: clerkUser.imageUrl,
        }
      : null;
  }, [clerkUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        getToken,
        isLoading: !isLoaded,
        logout,
        isSignedIn,
      }}
    >
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
