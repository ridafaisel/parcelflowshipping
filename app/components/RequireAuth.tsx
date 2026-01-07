"use client";

import { useAuth } from "../context/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
  // permission is an opaque string the backend understands. Frontend must
  // never hardcode or infer permissions — it must ask the backend.
  permission?: string;
}) {
  const { user, loading } = useAuth();


  if (loading) return <p>Loading session...</p>;
  if (!user) return null;

  return <>{children}</>;
}
