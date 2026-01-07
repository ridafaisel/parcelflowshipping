"use client";

import { useState } from "react";

export default function AuthTestPage() {
  const [result, setResult] = useState("");

  async function testAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      setResult("❌ No token found in localStorage");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setResult(`❌ Error: ${JSON.stringify(data)}`);
        return;
      }

      setResult(`✅ SUCCESS:\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setResult("❌ Network error");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Auth Test Page</h1>

      <button onClick={testAuth}>
        Test Protected Endpoint
      </button>

      <pre style={{ marginTop: 16 }}>
        {result}
      </pre>
    </div>
  );
}
