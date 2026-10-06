"use client";

import CorporateSettings from "@/components/dashboard/corporate/CorporateSettings";

// ============================================================================
// Corporate Dashboard — Settings page
// ============================================================================

export default function SettingsPage() {
  const handleSave = async (data: unknown) => {
    // TODO: Implement API call to save settings
    console.log("Saving settings:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your corporate profile and preferences.
        </p>
      </div>

      {/* Settings component */}
      <CorporateSettings
        initialCompanyName="PT Carbon Solutions Indonesia"
        initialEmail="buyer@carbonforge.id"
        initialPhone="+62 21 1234 5678"
        initialAddress="Jl. Sudirman No. 123, Jakarta Selatan, Indonesia"
        initialBillingEmail="billing@carbonforge.id"
        initialTaxId="01.234.567.8-091.000"
        initialAnnualTargetTon={50000}
        onSave={handleSave}
      />
    </div>
  );
}
