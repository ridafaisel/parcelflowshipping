import { Center, Location } from "./types";

interface NewLocationState {
  name: string;
  address: string;
  city: string;
  centerId: string;
}

interface NewCenterState {
  name: string;
  city: string;
  type: string;
}

interface ManageLocationsTabProps {
  locations: Location[];
  centers: Center[];
  centersLoading: boolean;
  loading: boolean;
  newLocation: NewLocationState;
  newCenter: NewCenterState;
  onChange: (updates: Partial<NewLocationState>) => void;
  onCenterChange: (updates: Partial<NewCenterState>) => void;
  onCreate: (e: React.FormEvent) => void;
  onCreateCenter: (e: React.FormEvent) => void;
  onDelete: (location: Location) => void;
  actionLoading: {
    create: boolean;
    deletingId: number | null;
  };
  centerActionLoading: {
    create: boolean;
  };
}

export default function ManageLocationsTab({
  locations,
  centers,
  centersLoading,
  loading,
  newLocation,
  newCenter,
  onChange,
  onCenterChange,
  onCreate,
  onCreateCenter,
  onDelete,
  actionLoading,
  centerActionLoading
}: ManageLocationsTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Center</h2>
        <form onSubmit={onCreateCenter} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={newCenter.name}
                onChange={(e) => onCenterChange({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Central Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={newCenter.city}
                onChange={(e) => onCenterChange({ city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Addis Ababa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <input
              type="text"
              required
              value={newCenter.type}
              onChange={(e) => onCenterChange({ type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Main"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={centerActionLoading.create}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {centerActionLoading.create ? "Adding..." : "Add Center"}
            </button>
          </div>
        </form>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Location</h2>
        <form onSubmit={onCreate} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={newLocation.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Downtown Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={newLocation.city}
                onChange={(e) => onChange({ city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Addis Ababa"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                required
                value={newLocation.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bole Road, Building 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center *
              </label>
              <select
                value={newLocation.centerId}
                onChange={(e) => onChange({ centerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={centersLoading}
                required
              >
                <option value="">
                  {centersLoading ? "Loading centers..." : "Select a center"}
                </option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={actionLoading.create}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading.create ? "Adding..." : "Add Location"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Existing Locations</h3>
          <span className="text-sm text-gray-500">Total: {locations.length}</span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No locations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-xs text-gray-500">#{location.id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{location.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{location.address}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onDelete(location)}
                        disabled={actionLoading.deletingId === location.id}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {actionLoading.deletingId === location.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
