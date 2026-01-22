import { Customer, Location, Package } from "./types";

interface DebugInfoProps {
  packages: Package[];
  customers: Customer[];
  locations: Location[];
  user?: {
    role?: string;
    permissions?: string[];
  } | null;
}

export default function DebugInfo({ packages, customers, locations, user }: DebugInfoProps) {
  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
      <details>
        <summary className="cursor-pointer font-medium">Debug Information</summary>
        <div className="mt-2 space-y-2">
          <div>Token exists: {localStorage.getItem("token") ? "Yes" : "No"}</div>
          <div>Customers loaded: {customers.length}</div>
          <div>Locations loaded: {locations.length}</div>
          <div>User role: {user?.role || "Unknown"}</div>
          <div>User permissions: {user?.permissions?.join(", ") || "None"}</div>
          <button
            onClick={() => {
              console.log("Current packages:", packages);
              console.log("Current customers:", customers);
              console.log("Current locations:", locations);
              console.log("Token:", localStorage.getItem("token"));
            }}
            className="mt-2 px-3 py-1 bg-gray-200 rounded text-xs"
          >
            Log to Console
          </button>
        </div>
      </details>
    </div>
  );
}
