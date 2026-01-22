interface AdminHeaderProps {
  user?: {
    role?: string;
    permissions?: string[];
  } | null;
  onLogout: () => void;
}

export default function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage packages and system operations</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              {user?.role || "Unknown"}
            </span>
            <span className="text-sm text-gray-500">
              {user?.permissions?.length ? `Permissions: ${user.permissions.join(", ")}` : "No permissions"}
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
