"use client";

import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <RequireAuth>
      <div style={{ padding: 24 }}>
        <h1>Customer Dashboard</h1>
        <p>Logged in as: {user?.role}</p>
        <button onClick={logout}>Logout</button>
      </div>
    </RequireAuth>
  );
}
