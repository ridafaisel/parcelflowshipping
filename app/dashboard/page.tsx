"use client";

import RequireAuth from "../components/RequireAuth";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="min-h-[70vh] bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Dashboard
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">
            This page is under development
          </h1>
          <p className="mt-3 text-gray-600">
            We’re building a cleaner dashboard experience. For now, access the
            full admin tools below.
          </p>
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
