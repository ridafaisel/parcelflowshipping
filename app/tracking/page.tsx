"use client";

import { useState } from "react";

export default function TrackingPage() {
  const [number, setNumber] = useState("");
  const [info, setInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(`http://localhost:4000/tracking?number=${encodeURIComponent(number)}`);
      if (!res.ok) {
        setError("Tracking lookup failed");
        return;
      }
      const data = await res.json();
      setInfo(data);
    } catch {
      setError("Tracking lookup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold">Track a Package</h1>

        <form onSubmit={handleLookup} className="mt-4 space-y-3">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full border p-2 rounded"
            required
          />
          <button className="bg-black text-white px-4 py-2 rounded">Lookup</button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {info && (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <pre className="text-sm">{JSON.stringify(info, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
