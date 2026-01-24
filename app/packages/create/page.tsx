"use client";

import RequireAuth from "../../components/RequireAuth";
import { useState } from "react";
import { getApiBaseUrl } from "../../lib/api";

export default function CreatePackagePage() {
  const API_BASE_URL = getApiBaseUrl();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (res.status === 403) {
        setError("Forbidden");
        return;
      }

      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      setSuccess("Package created: " + (data.id || "(unknown id)"));
      setTrackingNumber("");
    } catch {
      setError("Failed to create package");
    }
  };

  return (
    <RequireAuth permission="CREATE_PACKAGE">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Create Package</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <form onSubmit={handleCreate} className="mt-4 space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
          <button className="bg-black text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
    </RequireAuth>
  );
}
