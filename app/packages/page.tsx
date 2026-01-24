"use client";

import RequireAuth from "../components/RequireAuth";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "../lib/api";

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
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
  location?: Location; // Optional if included
}

interface Package {
  id: number;
  weight: number;
  dimensions: string;
  status: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  transportationId: number;
  currentLocationId: number;
  tracks: Track[];
  sender: Customer;
  receiver: Customer;
  transportation: Transportation;
  currentLocation: Location;
}

export default function PackagesPage() {
  const API_BASE_URL = getApiBaseUrl();
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/packages`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (res.status === 403) {
          setError("Forbidden - You don't have permission to view packages");
          return;
        }

        if (!res.ok) throw new Error(`Failed to load packages: ${res.status}`);
        
        const data = await res.json();
        console.log("API Response:", data); // Debug log
        
        if (!cancelled) {
          setPackages(data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading packages:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load packages");
          setPackages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time only
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'AT_CENTER': return 'bg-yellow-100 text-yellow-800';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800';
      case 'CREATED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <RequireAuth permission="VIEW_PACKAGES">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading packages...</p>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth permission="VIEW_PACKAGES">
      <div className="p-4 md:p-6 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Package Management</h1>
          <p className="text-gray-600 mt-1">View and manage all packages in the system</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {packages && packages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold mt-1">{packages.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-2xl font-bold mt-1 text-gray-600">
                {packages.filter(p => p.status === 'CREATED').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {packages.filter(p => p.status === 'IN_TRANSIT').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">At Center</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {packages.filter(p => p.status === 'AT_CENTER').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {packages.filter(p => p.status === 'DELIVERED').length}
              </p>
            </div>
          </div>
        )}

        {/* Packages List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {!packages || packages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No packages found</h3>
              <p className="mt-1 text-gray-500">No packages have been created yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender → Receiver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transportation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      {/* Package ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">#{pkg.id}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              PKG-{pkg.id.toString().padStart(6, '0')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pkg.weight}kg • {pkg.dimensions}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sender → Receiver */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {pkg.sender?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {pkg.sender?.email}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            <span className="inline-block mx-1">→</span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {pkg.receiver?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {pkg.receiver?.email}
                          </div>
                        </div>
                      </td>

                      {/* Package Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {pkg.tracks?.length || 0} tracking points
                          </div>
                          <div className="text-xs text-gray-500">
                            Transportation: #{pkg.transportationId}
                          </div>
                        </div>
                      </td>

                      {/* Current Location */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {pkg.currentLocation?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {pkg.currentLocation?.city}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[120px]">
                            {pkg.currentLocation?.address}
                          </div>
                        </div>
                      </td>

                      {/* Transportation */}
                      <td className="px-6 py-4">
                        {pkg.transportation ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 flex items-center">
                              <span className="mr-2">🚚</span>
                              {pkg.transportation.type}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pkg.transportation.fromLocation?.city} → {pkg.transportation.toLocation?.city}
                            </div>
                            <div className="text-xs text-gray-400">
                              Dep: {formatTime(pkg.transportation.departureTime)}
                            </div>
                            <div className="text-xs text-gray-400">
                              Arr: {formatTime(pkg.transportation.arrivalTime)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Not assigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-start">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pkg.status)}`}>
                            {formatStatus(pkg.status)}
                          </span>
                          {pkg.tracks && pkg.tracks.length > 0 && (
                            <div className="mt-1 text-xs text-gray-500">
                              Last update: {formatTime(pkg.tracks[pkg.tracks.length - 1].timestamp)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(pkg.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Package Details Modal (Optional) */}
        {packages && packages.length > 0 && (
          <div className="mt-6">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-gray-700">
                📊 Package Statistics & Actions
              </summary>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Quick Stats</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Total packages: {packages.length}</li>
                    <li>• Average weight: {(packages.reduce((sum, p) => sum + p.weight, 0) / packages.length).toFixed(1)}kg</li>
                    <li>• Active transportations: {new Set(packages.map(p => p.transportationId)).size}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Activity</h4>
                  <ul className="text-sm space-y-1">
                    {packages.slice(0, 3).map(pkg => (
                      <li key={pkg.id} className="truncate">
                        • PKG-{pkg.id}: {pkg.status} at {formatTime(pkg.createdAt)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => window.print()}
                      className="w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      Print Report
                    </button>
                    <button 
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(packages, null, 2))}
                      className="w-full text-left px-3 py-2 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      Copy Data
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
