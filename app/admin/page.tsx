"use client";

import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/admin/AdminHeader";
import LoginPrompt from "../components/admin/LoginPrompt";
import LoadingDashboard from "../components/admin/LoadingDashboard";
import ErrorAlert from "../components/admin/ErrorAlert";
import TabsNav from "../components/admin/TabsNav";
import CreatePackageForm from "../components/admin/CreatePackageForm";
import UpdateStatusForm from "../components/admin/UpdateStatusForm";
import PackagesTable from "../components/admin/PackagesTable";
import QuickStats from "../components/admin/QuickStats";
import DebugInfo from "../components/admin/DebugInfo";
import ManageLocationsTab from "../components/admin/ManageLocationsTab";
import { Center, Customer, Location, Package } from "../components/admin/types";
import { getApiBaseUrl } from "../lib/api";

export default function AdminDashboard() {
  const API_BASE_URL = getApiBaseUrl();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("VIEW_PACKAGES");
  const [packages, setPackages] = useState<Package[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState({
    packages: true,
    customers: true,
    locations: true,
    centers: true
  });
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Form states
  const [newPackage, setNewPackage] = useState({
    weight: "",
    dimensions: "",
    senderId: "",
    receiverId: "",
    currentLocationId: "",
    transportationId: ""
  });

  const [updateStatus, setUpdateStatus] = useState({
    packageId: "",
    status: "IN_TRANSIT",
    locationId: ""
  });

  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    city: "",
    centerId: ""
  });

  const [newCenter, setNewCenter] = useState({
    name: "",
    city: "",
    type: ""
  });

  const [locationActionLoading, setLocationActionLoading] = useState<{
    create: boolean;
    deletingId: number | null;
  }>({
    create: false,
    deletingId: null
  });

  const [centerActionLoading, setCenterActionLoading] = useState<{
    create: boolean;
  }>({
    create: false
  });

  const handleNewPackageChange = (updates: Partial<typeof newPackage>) => {
    setNewPackage((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateStatusChange = (updates: Partial<typeof updateStatus>) => {
    setUpdateStatus((prev) => ({ ...prev, ...updates }));
  };

  const handleNewLocationChange = (updates: Partial<typeof newLocation>) => {
    setNewLocation((prev) => ({ ...prev, ...updates }));
  };

  const handleNewCenterChange = (updates: Partial<typeof newCenter>) => {
    setNewCenter((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectPackage = (pkg: Package) => {
    setUpdateStatus({
      packageId: pkg.id.toString(),
      status: pkg.status,
      locationId: pkg.currentLocation.id.toString()
    });
    setActiveTab("UPDATE_PACKAGE_STATUS");
  };

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      setError("Please login to access the dashboard");
      return null;
    }
    return token;
  };

  // Fetch data on component mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchData();
    }
  }, []);

  // Fetch data when tab changes to VIEW_PACKAGES
  useEffect(() => {
    const token = getToken();
    if (token && activeTab === "VIEW_PACKAGES") {
      fetchPackages();
    }
  }, [activeTab]);

  useEffect(() => {
    const token = getToken();
    if (token && activeTab === "MANAGE_LOCATIONS") {
      fetchCenters();
    }
  }, [activeTab]);

  async function fetchData() {
    const token = getToken();
    if (!token) return;
    
    await Promise.all([
      fetchPackages(),
      fetchCustomers(),
      fetchLocations(),
      fetchCenters()
    ]);
  }

  async function fetchPackages() {
    const token = getToken();
    if (!token) return;
    
    try {
      setLoading(prev => ({ ...prev, packages: true }));
      setError(null);
      
      console.log("Fetching packages...");
      const response = await fetch(`${API_BASE_URL}/packages`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Packages response status:", response.status);
      
      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Authentication failed" }));
        setError(`Authentication error: ${errorData.error}`);
        
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          setShowLoginPrompt(true);
        }
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Packages data received:", data);
      setPackages(data);
      
    } catch (err) {
      console.error("Failed to load packages:", err);
      setError(err instanceof Error ? err.message : "Failed to load packages");
    } finally {
      setLoading(prev => ({ ...prev, packages: false }));
    }
  }

  async function fetchCustomers() {
    const token = getToken();
    if (!token) return;
    
    try {
      setLoading(prev => ({ ...prev, customers: true }));
      
      console.log("Fetching customers...");
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Customers response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Customers data received:", data);
        setCustomers(data);
      } else {
        console.error("Failed to fetch customers:", response.status);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  }

  async function fetchLocations() {
    const token = getToken();
    if (!token) return;
    
    try {
      setLoading(prev => ({ ...prev, locations: true }));
      
      console.log("Fetching locations...");
      const response = await fetch(`${API_BASE_URL}/locations`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      console.log("Locations response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Locations data received:", data);
        setLocations(data);
      } else {
        console.error("Failed to fetch locations:", response.status);
      }
    } catch (err) {
      console.error("Failed to load locations:", err);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  }

  async function fetchCenters() {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(prev => ({ ...prev, centers: true }));

      const response = await fetch(`${API_BASE_URL}/locations/centers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      } else {
        console.error("Failed to fetch centers:", response.status);
      }
    } catch (err) {
      console.error("Failed to load centers:", err);
    } finally {
      setLoading(prev => ({ ...prev, centers: false }));
    }
  }

  // Form handlers
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    
    try {
      setError(null);
      
      // Validate form data
      if (!newPackage.weight || !newPackage.dimensions || !newPackage.senderId || 
          !newPackage.receiverId || !newPackage.currentLocationId) {
        setError("Please fill all required fields");
        return;
      }
      
      console.log("Creating package with data:", newPackage);
      
      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      body: JSON.stringify({
  weight: parseFloat(newPackage.weight),
  dimensions: newPackage.dimensions,
  senderId: parseInt(newPackage.senderId),
  receiverId: parseInt(newPackage.receiverId),
  currentLocationId: parseInt(newPackage.currentLocationId),
  transportationId: newPackage.transportationId ? parseInt(newPackage.transportationId) : 3
  // Send null instead of undefined or empty string
})
      });

      console.log("Create package response status:", response.status);
      
      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Permission denied" }));
        alert(`❌ ${errorData.error || "You don't have permission to create packages"}`);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create package error response:", errorText);
        let errorMessage = "Failed to create package";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const createdPackage = await response.json();
      console.log("Package created successfully:", createdPackage);
      
      // Add new package to state
      setPackages(prev => [createdPackage, ...prev]);
      
      // Reset form
      setNewPackage({
        weight: "",
        dimensions: "",
        senderId: "",
        receiverId: "",
        currentLocationId: "",
        transportationId: ""
      });

      // Switch to view tab
      setActiveTab("VIEW_PACKAGES");
      
      alert(`✅ Package created successfully! ID: ${createdPackage.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create package";
      setError(message);
      alert(`❌ Error: ${message}`);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    
    try {
      setError(null);
      
      if (!updateStatus.packageId || !updateStatus.locationId) {
        setError("Please select a package and location");
        return;
      }
      
      console.log("Updating package status:", updateStatus);
      
      const response = await fetch(`${API_BASE_URL}/packages/${updateStatus.packageId}/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: updateStatus.status,
          locationId: parseInt(updateStatus.locationId)
        })
      });

      console.log("Update status response status:", response.status);
      
      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Permission denied" }));
        alert(`❌ ${errorData.error || "You don't have permission to update package status"}`);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update status error response:", errorText);
        let errorMessage = "Failed to update status";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const updatedPackage = await response.json();
      console.log("Status updated successfully:", updatedPackage);
      
      // Update package in state
      setPackages(prev => prev.map(pkg => 
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      ));
      
      // Reset form
      setUpdateStatus({
        packageId: "",
        status: "IN_TRANSIT",
        locationId: ""
      });

      alert(`✅ Package ${updateStatus.packageId} status updated to ${updateStatus.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
      alert(`❌ Error: ${message}`);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      setError(null);

      if (!newLocation.name || !newLocation.address || !newLocation.city || !newLocation.centerId) {
        setError("Please fill all required location fields, including center");
        return;
      }

      setLocationActionLoading((prev) => ({ ...prev, create: true }));

      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newLocation.name,
          address: newLocation.address,
          city: newLocation.city,
          centerId: parseInt(newLocation.centerId)
        })
      });

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Permission denied" }));
        alert(`??? ${errorData.error || "You don't have permission to create locations"}`);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to create location";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const createdLocation = await response.json();
      setLocations((prev) =>
        [...prev, createdLocation].sort((a, b) => a.name.localeCompare(b.name))
      );

      setNewLocation({
        name: "",
        address: "",
        city: "",
        centerId: ""
      });

      alert(`??? Location created successfully! ID: ${createdLocation.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create location";
      setError(message);
      alert(`??? Error: ${message}`);
    } finally {
      setLocationActionLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleCreateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      setError(null);

      if (!newCenter.name || !newCenter.city || !newCenter.type) {
        setError("Please fill all required center fields");
        return;
      }

      setCenterActionLoading({ create: true });

      const response = await fetch(`${API_BASE_URL}/locations/centers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCenter.name,
          city: newCenter.city,
          type: newCenter.type
        })
      });

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Permission denied" }));
        alert(`??? ${errorData.error || "You don't have permission to create centers"}`);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to create center";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      const createdCenter = await response.json();
      setCenters((prev) =>
        [...prev, createdCenter].sort((a, b) => a.name.localeCompare(b.name))
      );

      setNewCenter({
        name: "",
        city: "",
        type: ""
      });

      alert(`??? Center created successfully! ID: ${createdCenter.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create center";
      setError(message);
      alert(`??? Error: ${message}`);
    } finally {
      setCenterActionLoading({ create: false });
    }
  };

  const handleDeleteLocation = async (location: Location) => {
    const token = getToken();
    if (!token) return;

    const confirmed = window.confirm(
      `Delete location "${location.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setError(null);
      setLocationActionLoading((prev) => ({ ...prev, deletingId: location.id }));

      const response = await fetch(`${API_BASE_URL}/locations/${location.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: "Permission denied" }));
        alert(`??? ${errorData.error || "You don't have permission to delete locations"}`);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to delete location";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setLocations((prev) => prev.filter((loc) => loc.id !== location.id));
      alert(`??? Location "${location.name}" deleted`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete location";
      setError(message);
      alert(`??? Error: ${message}`);
    } finally {
      setLocationActionLoading((prev) => ({ ...prev, deletingId: null }));
    }
  };


  // Tab definitions
  const tabs = [
    { id: "CREATE_PACKAGE", name: "Create Package" },
    { id: "UPDATE_PACKAGE_STATUS", name: "Update Status" },
    { id: "VIEW_PACKAGES", name: "View Packages" },
    { id: "MANAGE_LOCATIONS", name: "Locations" }
  ];

  // Login prompt
  if (showLoginPrompt) {
    return (
      <LoginPrompt
        onGoToLogin={() => router.push("/login")}
        onClearSession={() => {
          localStorage.removeItem("token");
          router.refresh();
        }}
      />
    );
  }

  // Loading state
  if (loading.packages && loading.customers && loading.locations && loading.centers) {
    return (
      <LoadingDashboard />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <AdminHeader user={user} onLogout={logout} />

      {error && (
        <ErrorAlert error={error} onDismiss={() => setError(null)} />
      )}

      <TabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        {/* CREATE_PACKAGE Form */}
        {activeTab === "CREATE_PACKAGE" && (
          <CreatePackageForm
            newPackage={newPackage}
            onChange={handleNewPackageChange}
            onSubmit={handleCreatePackage}
            customers={customers}
            locations={locations}
            loading={loading}
          />
        )}

        {/* UPDATE_PACKAGE_STATUS Form */}
        {activeTab === "UPDATE_PACKAGE_STATUS" && (
          <UpdateStatusForm
            updateStatus={updateStatus}
            onChange={handleUpdateStatusChange}
            onSubmit={handleUpdateStatus}
            packages={packages}
            locations={locations}
            loading={loading}
          />
        )}

        {/* VIEW_PACKAGES Table */}
        {activeTab === "VIEW_PACKAGES" && (
          <PackagesTable
            packages={packages}
            loading={loading.packages}
            onRefresh={fetchPackages}
            onCreateFirst={() => setActiveTab("CREATE_PACKAGE")}
            onSelectPackage={handleSelectPackage}
          />
        )}

        {activeTab === "MANAGE_LOCATIONS" && (
          <ManageLocationsTab
            locations={locations}
            loading={loading.locations}
            centers={centers}
            centersLoading={loading.centers}
            newLocation={newLocation}
            newCenter={newCenter}
            onChange={handleNewLocationChange}
            onCenterChange={handleNewCenterChange}
            onCreate={handleCreateLocation}
            onCreateCenter={handleCreateCenter}
            onDelete={handleDeleteLocation}
            actionLoading={locationActionLoading}
            centerActionLoading={centerActionLoading}
          />
        )}
      </div>

      <QuickStats packages={packages} />
      <DebugInfo packages={packages} customers={customers} locations={locations} user={user} />
    </div>
  );
}
