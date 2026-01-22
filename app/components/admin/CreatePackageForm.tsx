import { Customer, Location } from "./types";

interface NewPackageState {
  weight: string;
  dimensions: string;
  senderId: string;
  receiverId: string;
  currentLocationId: string;
  transportationId: string;
}

interface CreatePackageFormProps {
  newPackage: NewPackageState;
  onChange: (updates: Partial<NewPackageState>) => void;
  onSubmit: (e: React.FormEvent) => void;
  customers: Customer[];
  locations: Location[];
  loading: {
    customers: boolean;
    locations: boolean;
  };
}

export default function CreatePackageForm({
  newPackage,
  onChange,
  onSubmit,
  customers,
  locations,
  loading
}: CreatePackageFormProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Package</h2>
      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg) *
            </label>
            <input
              type="number"
              step="0.1"
              required
              value={newPackage.weight}
              onChange={(e) => onChange({ weight: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimensions (Lš?Wš?H cm) *
            </label>
            <input
              type="text"
              required
              value={newPackage.dimensions}
              onChange={(e) => onChange({ dimensions: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="30x20x15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sender *
            </label>
            <select
              required
              value={newPackage.senderId}
              onChange={(e) => onChange({ senderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.customers}
            >
              <option value="">{loading.customers ? "Loading customers..." : "Select sender"}</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receiver *
            </label>
            <select
              required
              value={newPackage.receiverId}
              onChange={(e) => onChange({ receiverId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading.customers}
            >
              <option value="">{loading.customers ? "Loading customers..." : "Select receiver"}</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Location *
            </label>
            <select
              required
              value={newPackage.currentLocationId}
              onChange={(e) => onChange({ currentLocationId: e.target.value })}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transportation (Optional)
            </label>
            <select
              value={newPackage.transportationId}
              onChange={(e) => onChange({ transportationId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select transportation</option>
              <option value="1">Truck #1</option>
              <option value="2">Truck #2</option>
              <option value="3">Van #1</option>
            </select>
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
  );
}
