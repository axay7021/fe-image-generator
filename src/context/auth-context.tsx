"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
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
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get Clerk auth state
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setToken(null);
      localStorage.removeItem("user_data");
      localStorage.removeItem("access_token");
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded) return;

      if (isSignedIn) {
        try {
          // 1. Try to get from LocalStorage first to avoid API call
          const cachedDataStr = localStorage.getItem("user_data");
          if (cachedDataStr) {
            try {
              const cachedData = JSON.parse(cachedDataStr);
              // Expected structure: { tokens: { access_token: ... }, user: { ... } }

              const backendToken =
                cachedData.tokens?.access_token || cachedData.token;
              const userObj = cachedData.user || cachedData;

              if (backendToken && userObj) {
                setToken(backendToken);
                setUser(userObj);
                setIsLoading(false);
                return; // Skip API call
              }
            } catch (err) {
              console.error("Error parsing cached user data", err);
              // Fall through to API call
            }
          }

          // 2. Fallback: API Call
          const clerkToken = await getToken();

          if (!clerkToken) {
            throw new Error("No token available");
          }

          // setToken(clerkToken); // We want the backend token, not clerk token?
          // Actually, let's wait for backend response.

          // Sync with backend
          const url = process.env.NEXT_PUBLIC_BASE_URL;
          if (!url) {
            console.error("API URL is not configured");
            return;
          }

          const response = await fetch(`${url}/user/auth/clerk/auth-check`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${clerkToken}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          });

          const data = await response.json();

          if (response.ok && data.success && data.data) {
            // Backend returns { tokens: {...}, user: {...} } based on user input
            const responseData = data.data;

            const backendToken = responseData.tokens?.access_token;
            const userObj = responseData.user;

            if (userObj) setUser(userObj);
            if (backendToken) setToken(backendToken);

            localStorage.setItem("user_data", JSON.stringify(responseData));
          } else {
            console.error("Failed to sync user with backend:", data.message);
          }
        } catch (error) {
          console.error("Error syncing with backend:", error);
          toast.error("Failed to synchronize account information");
        }
      } else {
        // Handle logout / not signed in
        setUser(null);
        setToken(null);
        localStorage.removeItem("user_data");
        localStorage.removeItem("access_token");
      }

      setIsLoading(false);
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, getToken, clerkUser]); // Re-run if clerk user changes

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout }}>
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
