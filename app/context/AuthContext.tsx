"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/api";

type User = Record<string, any> | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  // login returns the hydrated user after exchanging token with /auth/me
  login: (token: string) => Promise<User>;
  logout: () => void;
  // ask backend whether the current user has a specific permission
  checkPermission: (permission: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const API_BASE_URL = getApiBaseUrl();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current session from backend. Returns the user object or null.
  async function fetchMe(): Promise<User> {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      setUser(data);
      return data;
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

async function login(token: string) {
  localStorage.setItem("token", token);
  // hydrate session from backend and return the user object
  const u = await fetchMe();
  return u;
}

// Ask backend whether the currently authenticated user has a permission.
// This prevents the frontend from making any authorization decisions locally.
async function checkPermission(permission: string) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Use GET with query parameters instead of body
    const res = await fetch(
      `${API_BASE_URL}/auth/check-permission?permission=${encodeURIComponent(permission)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 403 || res.status === 401) return false;
    if (!res.ok) throw new Error("Authorization check failed");

    const data = await res.json();
    return !!data.allowed;
  } catch {
    return false;
  }
}



  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
