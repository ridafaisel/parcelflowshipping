import { Package } from "./types";

interface PackagesTableProps {
  packages: Package[];
  loading: boolean;
  onRefresh: () => void;
  onCreateFirst: () => void;
  onSelectPackage: (pkg: Package) => void;
}

export default function PackagesTable({
  packages,
  loading,
  onRefresh,
  onCreateFirst,
  onSelectPackage
}: PackagesTableProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Packages</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Total: {packages.length} packages
          </span>
          <button
            onClick={onRefresh}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No packages found</div>
          <button
            onClick={onCreateFirst}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Create your first package 
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender Receiver
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
                    <div className="font-medium text-gray-900">#{pkg.id}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className="font-medium">{pkg.sender.name}</div>
                      <div className="text-gray-500 text-xs">{pkg.sender.email}</div>
                      <div className="mt-1 text-xs text-gray-400"></div>
                      <div className="font-medium">{pkg.receiver.name}</div>
                      <div className="text-gray-500 text-xs">{pkg.receiver.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{pkg.weight} kg</div>
                      <div className="text-gray-500">{pkg.dimensions}</div>
                      <div className="text-xs text-gray-400">
                        {pkg.currentLocation.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${pkg.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                          pkg.status === "IN_TRANSIT" ? "bg-blue-100 text-blue-800" :
                          pkg.status === "AT_CENTER" ? "bg-yellow-100 text-yellow-800" :
                          pkg.status === "OUT_FOR_DELIVERY" ? "bg-orange-100 text-orange-800" :
                          "bg-gray-100 text-gray-800"}
                      `}
                    >
                      {pkg.status.replace("_", " ")}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {pkg.tracks.length} tracking points
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectPackage(pkg)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
