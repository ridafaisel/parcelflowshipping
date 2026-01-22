import { Location, Package } from "./types";

interface UpdateStatusState {
  packageId: string;
  status: string;
  locationId: string;
}

interface UpdateStatusFormProps {
  updateStatus: UpdateStatusState;
  onChange: (updates: Partial<UpdateStatusState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  packages: Package[];
  locations: Location[];
  loading: {
    locations: boolean;
  };
}

export default function UpdateStatusForm({
  updateStatus,
  onChange,
  onSubmit,
  packages,
  locations,
  loading
}: UpdateStatusFormProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Package Status</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Package *
          </label>
          <select
            required
            value={updateStatus.packageId}
            onChange={(e) => onChange({ packageId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a package...</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                Package #{pkg.id} - {pkg.sender.name} & {pkg.receiver.name} ({pkg.status})
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
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CREATED">Created</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="AT_CENTER">At Center</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <select
              required
              value={updateStatus.locationId}
              onChange={(e) => onChange({ locationId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.locations}
            >
              <option value="">{loading.locations ? "Loading locations..." : "Select location"}</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {updateStatus.packageId && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800">Current Status</h3>
            <p className="text-sm text-blue-600 mt-1">
              {packages.find((p) => p.id === parseInt(updateStatus.packageId))?.status || "Unknown"}
            </p>
            <p className="text-sm text-blue-600">
              Current Location:{" "}
              {packages.find((p) => p.id === parseInt(updateStatus.packageId))?.currentLocation.name}
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={!updateStatus.packageId || !updateStatus.locationId}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </form>
    </div>
  );
}
