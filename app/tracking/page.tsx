"use client";

import { useState } from "react";
import { getApiBaseUrl } from "../lib/api";
import RequireAuth from "../components/RequireAuth";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  centerId: number;
}

interface Transportation {
  id: number;
  type: string;
  departureTime: string;
  arrivalTime: string;
  fromLocationId: number;
  toLocationId: number;
  fromLocation: Location;
  toLocation: Location;
}

interface Track {
  id: number;
  status: string;
  timestamp: string;
  packageId: number;
  locationId: number;
  location: Location;
}

interface PackageDetails {
  id: number;
  weight: number;
  dimensions: string;
  status: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  transportationId: number;
  currentLocationId: number;
  sender: Contact;
  receiver: Contact;
  currentLocation: Location;
  transportation: Transportation;
  tracks: Track[];
}

export default function TrackingPage() {
  const API_BASE_URL = getApiBaseUrl();
  const [packageId, setPackageId] = useState("");
  const [details, setDetails] = useState<PackageDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status: string) => status.replace(/_/g, " ");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "AT_CENTER":
        return "bg-yellow-100 text-yellow-800";
      case "OUT_FOR_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "CREATED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDetails(null);

    const parsedId = Number(packageId);
    if (!Number.isInteger(parsedId)) {
      setError("Please enter a valid package ID");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/tracking/${parsedId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 404) {
        setError("Package not found for this ID");
        return;
      }

      if (!res.ok) {
        setError("Tracking lookup failed");
        return;
      }

      const data = (await res.json()) as PackageDetails;
      setDetails(data);
    } catch {
      setError("Tracking lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="p-4 md:p-6 min-h-screen bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tracking</h1>
          <p className="text-gray-600 mt-1">Enter a package ID to view its status and history</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <form onSubmit={handleLookup} className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="packageId">
                Package ID
              </label>
              <input
                id="packageId"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                placeholder="e.g. 123"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Searching..." : "Lookup"}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {details && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Package</p>
                <p className="text-xl font-bold mt-1">PKG-{details.id.toString().padStart(6, "0")}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {details.weight}kg - {details.dimensions}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(details.status)}`}>
                  {formatStatus(details.status)}
                </span>
                <p className="text-xs text-gray-500 mt-2">Created {formatDateTime(details.createdAt)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="text-sm font-medium mt-1 text-gray-900">{details.currentLocation?.name}</p>
                <p className="text-xs text-gray-500">{details.currentLocation?.city}</p>
                <p className="text-xs text-gray-400 truncate">{details.currentLocation?.address}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500">Transportation</p>
                <p className="text-sm font-medium mt-1 text-gray-900">{details.transportation?.type}</p>
                <p className="text-xs text-gray-500">
                  {details.transportation?.fromLocation?.city} {"->"} {details.transportation?.toLocation?.city}
                </p>
                <p className="text-xs text-gray-400">Dep {formatDateTime(details.transportation?.departureTime)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-800">Sender</h2>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-medium text-gray-900">{details.sender?.name}</p>
                  <p className="text-gray-500">{details.sender?.email}</p>
                  <p className="text-gray-500">{details.sender?.phone}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-800">Receiver</h2>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="font-medium text-gray-900">{details.receiver?.name}</p>
                  <p className="text-gray-500">{details.receiver?.email}</p>
                  <p className="text-gray-500">{details.receiver?.phone}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-800">Route</h2>
                <div className="mt-3 text-sm space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-medium text-gray-900">{details.transportation?.fromLocation?.name}</p>
                    <p className="text-gray-500">{details.transportation?.fromLocation?.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-medium text-gray-900">{details.transportation?.toLocation?.name}</p>
                    <p className="text-gray-500">{details.transportation?.toLocation?.city}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-4 md:px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Tracking History</h2>
                <p className="text-sm text-gray-500">Most recent updates first</p>
              </div>
              {details.tracks && details.tracks.length > 0 ? (
                <ul className="divide-y">
                  {details.tracks.map((track) => (
                    <li key={track.id} className="px-4 md:px-6 py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(track.status)}`}>
                            {formatStatus(track.status)}
                          </span>
                          <div className="mt-2 text-sm font-medium text-gray-900">
                            {track.location?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {track.location?.city} - {track.location?.address}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(track.timestamp)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 md:px-6 py-10 text-center text-gray-500">
                  No tracking history available.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
