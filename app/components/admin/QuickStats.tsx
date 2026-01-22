import { Package } from "./types";

interface QuickStatsProps {
  packages: Package[];
}

export default function QuickStats({ packages }: QuickStatsProps) {
  return (
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
              {packages.filter((p) => p.status === "IN_TRANSIT").length}
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
              {packages.filter((p) => p.status === "DELIVERED").length}
            </p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600">✅</span>
          </div>
        </div>
      </div>
    </div>
  );
}
