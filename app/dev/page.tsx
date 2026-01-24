"use client";

import { useState } from "react";
import { getApiBaseUrl } from "../lib/api";

export default function DevPage() {
  const API_BASE_URL = getApiBaseUrl();
  const [result, setResult] = useState<any>(null);

  const ping = async () => {
    const res = await fetch(`${API_BASE_URL}/test/ping`);
    setResult(await res.json());
  };

  // test creating a package
  const createPackage = async () => {
  const res = await fetch(`${API_BASE_URL}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      weight: 3.5,
      dimensions: "20x15x10",
      senderId: 1,
      receiverId: 2,
      transportationId: 1,
      currentLocationId: 1,
    }),
  });

  const data = await res.json();
  setResult(data);
};



const updateStatus = async () => {
 const res = await fetch(`${API_BASE_URL}/status/2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "IN_TRANSIT",
      locationId: 2,
    }),
  });
console.log(res.json);
setResult(res)

};

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">API Dev Tester</h1>

      <button
        onClick={ping}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Ping Backend
      </button>

      <button
  onClick={createPackage}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Create Package
</button>

<button
  onClick={updateStatus}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  update status
</button>


      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
