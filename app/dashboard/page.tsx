"use client";

import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
const actions = user?.permissions ?? [];

function HandleLogout() {
  logout();
  router.replace("/login");
}
  return (
    <RequireAuth>
      <div style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <p>Logged in as: {user ? JSON.stringify(user.role) : "-"}</p>

        <h2 className="mt-4">Available Actions</h2>
        {actions === null ? (
          <p>Loading actions...</p>
        ) : actions.length === 0 ? (
          <p>No actions available.</p>
        ) : (
          <ul>
            {actions.map((a:any) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        )}

        <button onClick={HandleLogout} className="mt-4 bg-black text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </RequireAuth>
  );
}
