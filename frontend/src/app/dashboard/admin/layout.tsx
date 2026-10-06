import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";

// ============================================================================
// Admin Dashboard Layout
// ============================================================================

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="pl-64">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
