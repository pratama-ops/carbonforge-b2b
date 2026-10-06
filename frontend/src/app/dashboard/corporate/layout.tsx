import CorporateSidebar from "@/components/dashboard/corporate/CorporateSidebar";

// ============================================================================
// Corporate Dashboard Layout
// ============================================================================

export default function CorporateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <CorporateSidebar />
      <main className="pl-64">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
