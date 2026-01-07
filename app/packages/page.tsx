"use client";

import RequireAuth from "../components/RequireAuth";
import { useEffect, useState } from "react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4000/packages", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.status === 403) {
          setError("Forbidden");
          return;
        }

        if (!res.ok) throw new Error("Failed to load packages");
        const data = await res.json();
        if (!cancelled) setPackages(data.packages || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load packages");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <RequireAuth permission="VIEW_PACKAGES">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Packages</h1>
        {error && <p className="text-red-500">{error}</p>}

        {packages === null ? (
          <p>Loading...</p>
        ) : packages.length === 0 ? (
          <p>No packages found.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {packages.map((p) => (
              <li key={p.id} className="p-2 bg-white rounded shadow">
                <div className="font-medium">{p.trackingNumber || p.id}</div>
                <div className="text-sm text-gray-600">{p.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </RequireAuth>
  );
}
