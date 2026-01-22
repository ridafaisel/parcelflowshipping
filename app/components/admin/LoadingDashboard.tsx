export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">Checking authentication</p>
      </div>
    </div>
  );
}
