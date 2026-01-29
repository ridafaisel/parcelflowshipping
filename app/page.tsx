export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="rounded-2xl border bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
            ParcelFlow
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Shipping management, simplified.
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Manage packages, track shipments, and keep customers updated with a clean,
            focused interface built for day-to-day operations.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </a>
            <a
              href="/tracking"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:border-gray-400"
            >
              Track a Package
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">Admin</p>
            <p className="mt-1 text-sm text-gray-600">
              Create packages, update statuses, manage locations.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">Customers</p>
            <p className="mt-1 text-sm text-gray-600">
              Fast tracking with a simple package ID lookup.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">Operations</p>
            <p className="mt-1 text-sm text-gray-600">
              Clear route visibility and shipment history.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
