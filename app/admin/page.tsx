"use client";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("CREATE_PACKAGE");

  // Mock data for packages
  const [packages, setPackages] = useState([
    { id: 1, trackingNumber: "PKG-123", status: "CREATED", sender: "John Doe", receiver: "Jane Smith" },
    { id: 2, trackingNumber: "PKG-456", status: "IN_TRANSIT", sender: "Acme Corp", receiver: "Globex Inc" },
    { id: 3, trackingNumber: "PKG-789", status: "DELIVERED", sender: "Bob Builder", receiver: "Wendy Worker" },
  ]);

  // Form states
  const [newPackage, setNewPackage] = useState({
    trackingNumber: "",
    sender: "",
    receiver: "",
    weight: "",
    dimensions: "",
    currentLocationId: 1
  });

  const [updateStatus, setUpdateStatus] = useState({
    packageId: "",
    status: "IN_TRANSIT",
    locationId: 1
  });

  // Tab definitions
  const tabs = [
    { id: "CREATE_PACKAGE", name: "Create Package", permission: "CREATE_PACKAGE" },
    { id: "UPDATE_PACKAGE_STATUS", name: "Update Status", permission: "UPDATE_PACKAGE_STATUS" },
    { id: "VIEW_PACKAGES", name: "View Packages", permission: "VIEW_PACKAGES" },
  ].filter(tab => user?.permissions?.includes(tab.permission));

  // Form handlers
  const handleCreatePackage = (e:any) => {
    e.preventDefault();
    const newPkg = {
      id: packages.length + 1,
      trackingNumber: newPackage.trackingNumber || `PKG-${Date.now()}`,
      status: "CREATED",
      sender: newPackage.sender,
      receiver: newPackage.receiver,
      weight: newPackage.weight,
      dimensions: newPackage.dimensions,
    };
    setPackages([...packages, newPkg]);
    alert(`Package created: ${newPkg.trackingNumber}`);
    setNewPackage({ trackingNumber: "", sender: "", receiver: "", weight: "", dimensions: "", currentLocationId: 1 });
  };

  const handleUpdateStatus = (e:any) => {
    e.preventDefault();
    const updatedPackages = packages.map(pkg => 
      pkg.id === parseInt(updateStatus.packageId) 
        ? { ...pkg, status: updateStatus.status }
        : pkg
    );
    setPackages(updatedPackages);
    alert(`Package ${updateStatus.packageId} status updated to ${updateStatus.status}`);
    setUpdateStatus({ packageId: "", status: "IN_TRANSIT", locationId: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage packages and system operations</p>
        <div className="mt-2 flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
            {user?.role}
          </span>
          <span className="text-sm text-gray-500">
            Permissions: {user?.permissions?.join(", ")}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        {/* CREATE_PACKAGE Form */}
        {activeTab === "CREATE_PACKAGE" && user?.permissions?.includes("CREATE_PACKAGE") && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Package</h2>
            <form onSubmit={handleCreatePackage} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newPackage.trackingNumber}
                    onChange={(e) => setNewPackage({...newPackage, trackingNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Will auto-generate if empty"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location ID
                  </label>
                  <select
                    value={newPackage.currentLocationId}
                    onChange={(e) => setNewPackage({...newPackage, currentLocationId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Warehouse 1</option>
                    <option value={2}>Warehouse 2</option>
                    <option value={3}>Distribution Center</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPackage.sender}
                    onChange={(e) => setNewPackage({...newPackage, sender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPackage.receiver}
                    onChange={(e) => setNewPackage({...newPackage, receiver: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jane Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPackage.weight}
                    onChange={(e) => setNewPackage({...newPackage, weight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions (L×W×H cm)
                  </label>
                  <input
                    type="text"
                    value={newPackage.dimensions}
                    onChange={(e) => setNewPackage({...newPackage, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="30×20×15"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        )}

        {/* UPDATE_PACKAGE_STATUS Form */}
        {activeTab === "UPDATE_PACKAGE_STATUS" && user?.permissions?.includes("UPDATE_PACKAGE_STATUS") && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Package Status</h2>
            <form onSubmit={handleUpdateStatus} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Package *
                </label>
                <select
                  required
                  value={updateStatus.packageId}
                  onChange={(e) => setUpdateStatus({...updateStatus, packageId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a package...</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.trackingNumber} - {pkg.sender} → {pkg.receiver} ({pkg.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status *
                  </label>
                  <select
                    required
                    value={updateStatus.status}
                    onChange={(e) => setUpdateStatus({...updateStatus, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CREATED">Created</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location ID
                  </label>
                  <select
                    value={updateStatus.locationId}
                    onChange={(e) => setUpdateStatus({...updateStatus, locationId: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Warehouse 1</option>
                    <option value={2}>Warehouse 2</option>
                    <option value={3}>Distribution Center</option>
                    <option value={4}>Delivery Hub</option>
                  </select>
                </div>
              </div>

              {updateStatus.packageId && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800">Current Status</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    {packages.find(p => p.id === parseInt(updateStatus.packageId))?.status || "Unknown"}
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!updateStatus.packageId}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW_PACKAGES Table */}
        {activeTab === "VIEW_PACKAGES" && user?.permissions?.includes("VIEW_PACKAGES") && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">All Packages</h2>
              <span className="text-sm text-gray-500">
                Total: {packages.length} packages
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender → Receiver
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{pkg.trackingNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="font-medium">{pkg.sender}</div>
                          <div className="text-gray-500">→ {pkg.receiver}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${pkg.status === "DELIVERED" ? "bg-green-100 text-green-800" : 
                            pkg.status === "IN_TRANSIT" ? "bg-blue-100 text-blue-800" : 
                            pkg.status === "CANCELLED" ? "bg-red-100 text-red-800" : 
                            "bg-gray-100 text-gray-800"}
                        `}>
                          {pkg.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {user?.permissions?.includes("UPDATE_PACKAGE_STATUS") && (
                            <button
                              onClick={() => {
                                setUpdateStatus({
                                  packageId: pkg.id.toString(),
                                  status: pkg.status,
                                  locationId: 1
                                });
                                setActiveTab("UPDATE_PACKAGE_STATUS");
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Update
                            </button>
                          )}
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {packages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No packages found</div>
                {user?.permissions?.includes("CREATE_PACKAGE") && (
                  <button
                    onClick={() => setActiveTab("CREATE_PACKAGE")}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Create your first package →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* No permission message */}
        {!user?.permissions?.includes(activeTab) && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Permission Required</h3>
            <p className="text-gray-600">
              You do not have the <span className="font-medium">{activeTab}</span> permission.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Packages</p>
              <p className="text-2xl font-bold mt-1">{packages.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Transit</p>
              <p className="text-2xl font-bold mt-1 text-orange-600">
                {packages.filter(p => p.status === "IN_TRANSIT").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600">🚚</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {packages.filter(p => p.status === "DELIVERED").length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}