"use client";

import { useState } from "react";
import AdminSettingsForm from "@/components/dashboard/admin/AdminSettings";
import type { AdminSettings } from "@/lib/types";

// ============================================================================
// Admin Dashboard — Settings Page
// ============================================================================

const mockSettings: AdminSettings = {
  platformName: "CarbonForge B2B",
  supportEmail: "support@carbonforge.id",
  maxLandAreaHa: 500,
  verificationRequired: true,
  autoApproveThreshold: 1000,
  maintenanceMode: false,
  notificationEmail: true,
  notificationSms: false,
  platformFeePercent: 2.5,
  fixedTransactionFee: 50000,
  minimumTransactionAmount: 1000000,
  maximumTransactionAmount: 1000000000,
  aiConfidenceThreshold: 85,
  documentToleranceDays: 7,
  maxDocumentsPerLand: 10,
  aiAutoExtraction: true,
  groqApiKey: "gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  webhookUrl: "https://api.carbonforge.id/webhooks/transactions",
  blockchainRegistryAddress: "0x1234567890abcdef1234567890abcdef12345678",
  apiRateLimit: 100,
  webhookRetryAttempts: 3,
  twoFactorRequired: true,
  sessionTimeoutMinutes: 30,
  ipWhitelistEnabled: false,
  whitelistedIps: ["192.168.1.100", "10.0.0.1"],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);

  const handleSave = (newSettings: AdminSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Konfigurasi platform CarbonForge
        </p>
      </div>

      {/* Settings Form */}
      <AdminSettingsForm settings={settings} onSave={handleSave} />
    </div>
  );
}
