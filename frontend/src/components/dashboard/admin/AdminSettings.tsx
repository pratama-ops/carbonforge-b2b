"use client";

import { useState } from "react";
import type { AdminSettings } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ============================================================================
// AdminSettings — Platform configuration form with tabs
// ============================================================================

type SettingsTab = "fees" | "verification" | "api" | "security";

interface AdminSettingsProps {
  settings: AdminSettings;
  onSave: (settings: AdminSettings) => void;
}

const tabs: { id: SettingsTab; label: string; description: string }[] = [
  { id: "fees", label: "Platform Fees", description: "Komisi dan biaya transaksi" },
  { id: "verification", label: "Verification Rules", description: "Aturan verifikasi dokumen" },
  { id: "api", label: "API & Integration", description: "Kunci API dan webhook" },
  { id: "security", label: "Admin Security", description: "Keamanan akun admin" },
];

export default function AdminSettingsForm({ settings, onSave }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("fees");
  const [formData, setFormData] = useState<AdminSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    onSave(formData);
    setSaving(false);
  };

  const handleReset = () => {
    setFormData(settings);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Settings tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Platform Fees Tab */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">Platform Fees</h3>
              <p className="mt-1 text-sm text-slate-500">Konfigurasi komisi platform per transaksi kredit karbon</p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Komisi Platform (%)"
                  type="number"
                  value={formData.platformFeePercent}
                  onChange={(e) => setFormData({ ...formData, platformFeePercent: Number(e.target.value) })}
                  min={0}
                  max={100}
                  step={0.1}
                  required
                />
                <Input
                  label="Biaya Transaksi Tetap (IDR)"
                  type="number"
                  value={formData.fixedTransactionFee}
                  onChange={(e) => setFormData({ ...formData, fixedTransactionFee: Number(e.target.value) })}
                  min={0}
                  required
                />
                <Input
                  label="Minimum Transaksi (IDR)"
                  type="number"
                  value={formData.minimumTransactionAmount}
                  onChange={(e) => setFormData({ ...formData, minimumTransactionAmount: Number(e.target.value) })}
                  min={0}
                  required
                />
                <Input
                  label="Maksimum Transaksi (IDR)"
                  type="number"
                  value={formData.maximumTransactionAmount}
                  onChange={(e) => setFormData({ ...formData, maximumTransactionAmount: Number(e.target.value) })}
                  min={0}
                  required
                />
              </div>

              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <h4 className="text-sm font-medium text-slate-900">Preview Perhitungan</h4>
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>Transaksi 100 ton CO2e @ Rp 85.000/ton:</p>
                  <p className="font-mono text-xs text-slate-500">
                    Subtotal: Rp {((100 * 85000) / 1).toLocaleString("id-ID")}
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    Komisi ({formData.platformFeePercent}%): Rp {((100 * 85000 * formData.platformFeePercent) / 100).toLocaleString("id-ID")}
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    Biaya Tetap: Rp {formData.fixedTransactionFee.toLocaleString("id-ID")}
                  </p>
                  <p className="font-mono text-xs font-medium text-emerald-600">
                    Total Biaya: Rp {((100 * 85000 * formData.platformFeePercent) / 100 + formData.fixedTransactionFee).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Rules Tab */}
        {activeTab === "verification" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">Verification Rules</h3>
              <p className="mt-1 text-sm text-slate-500">Threshold otomatisasi AI Extractor dan toleransi verifikasi dokumen</p>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="AI Confidence Threshold (%)"
                  type="number"
                  value={formData.aiConfidenceThreshold}
                  onChange={(e) => setFormData({ ...formData, aiConfidenceThreshold: Number(e.target.value) })}
                  min={0}
                  max={100}
                  required
                />
                <Input
                  label="Toleransi Dokumen (hari)"
                  type="number"
                  value={formData.documentToleranceDays}
                  onChange={(e) => setFormData({ ...formData, documentToleranceDays: Number(e.target.value) })}
                  min={0}
                  required
                />
                <Input
                  label="Ambang Auto-Approve (kredit)"
                  type="number"
                  value={formData.autoApproveThreshold}
                  onChange={(e) => setFormData({ ...formData, autoApproveThreshold: Number(e.target.value) })}
                  min={0}
                  required
                />
                <Input
                  label="Maks. Dokumen per Lahan"
                  type="number"
                  value={formData.maxDocumentsPerLand}
                  onChange={(e) => setFormData({ ...formData, maxDocumentsPerLand: Number(e.target.value) })}
                  min={1}
                  required
                />
              </div>

              <div className="mt-6 space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Verifikasi Manual Wajib</p>
                    <p className="text-xs text-slate-500">Semua pengajuan lahan harus diverifikasi admin</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.verificationRequired}
                    onClick={() => setFormData({ ...formData, verificationRequired: !formData.verificationRequired })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.verificationRequired ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.verificationRequired ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">AI Auto-Extraction</p>
                    <p className="text-xs text-slate-500">Gunakan AI untuk ekstraksi data dokumen otomatis</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.aiAutoExtraction}
                    onClick={() => setFormData({ ...formData, aiAutoExtraction: !formData.aiAutoExtraction })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.aiAutoExtraction ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.aiAutoExtraction ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* API & Integration Tab */}
        {activeTab === "api" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">API & Integration</h3>
              <p className="mt-1 text-sm text-slate-500">Pengaturan API Key Groq AI, Webhook, dan integrasi blockchain</p>

              <div className="mt-6 space-y-6">
                <div>
                  <Input
                    label="Groq AI API Key"
                    type={showApiKey ? "text" : "password"}
                    value={formData.groqApiKey}
                    onChange={(e) => setFormData({ ...formData, groqApiKey: e.target.value })}
                    placeholder="gsk_..."
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    {showApiKey ? "Sembunyikan" : "Tampilkan"} API Key
                  </button>
                </div>

                <Input
                  label="Webhook URL"
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                  placeholder="https://api.carbonforge.id/webhooks/transactions"
                />

                <Input
                  label="Blockchain Registry Address"
                  type="text"
                  value={formData.blockchainRegistryAddress}
                  onChange={(e) => setFormData({ ...formData, blockchainRegistryAddress: e.target.value })}
                  placeholder="0x..."
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="API Rate Limit (req/menit)"
                    type="number"
                    value={formData.apiRateLimit}
                    onChange={(e) => setFormData({ ...formData, apiRateLimit: Number(e.target.value) })}
                    min={1}
                    required
                  />
                  <Input
                    label="Webhook Retry Attempts"
                    type="number"
                    value={formData.webhookRetryAttempts}
                    onChange={(e) => setFormData({ ...formData, webhookRetryAttempts: Number(e.target.value) })}
                    min={0}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-semibold text-slate-900">Admin Security</h3>
              <p className="mt-1 text-sm text-slate-500">Pengaturan 2FA dan manajemen akses admin</p>

              <div className="mt-6 space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-slate-500">Wajibkan 2FA untuk semua akun admin</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.twoFactorRequired}
                    onClick={() => setFormData({ ...formData, twoFactorRequired: !formData.twoFactorRequired })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.twoFactorRequired ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.twoFactorRequired ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Session Timeout (menit)</p>
                    <p className="text-xs text-slate-500">Logout otomatis setelah periode tidak aktif</p>
                  </div>
                  <input
                    type="number"
                    value={formData.sessionTimeoutMinutes}
                    onChange={(e) => setFormData({ ...formData, sessionTimeoutMinutes: Number(e.target.value) })}
                    min={5}
                    max={480}
                    className="w-20 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-center focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">IP Whitelist</p>
                    <p className="text-xs text-slate-500">Batasi akses admin dari IP tertentu</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.ipWhitelistEnabled}
                    onClick={() => setFormData({ ...formData, ipWhitelistEnabled: !formData.ipWhitelistEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.ipWhitelistEnabled ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.ipWhitelistEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </label>

                {formData.ipWhitelistEnabled && (
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-900">IP Addresses</p>
                    <div className="mt-2 space-y-2">
                      {formData.whitelistedIps.map((ip, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={ip}
                            onChange={(e) => {
                              const newIps = [...formData.whitelistedIps];
                              newIps[index] = e.target.value;
                              setFormData({ ...formData, whitelistedIps: newIps });
                            }}
                            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newIps = formData.whitelistedIps.filter((_, i) => i !== index);
                              setFormData({ ...formData, whitelistedIps: newIps });
                            }}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, whitelistedIps: [...formData.whitelistedIps, ""] })}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        + Tambah IP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" loading={saving}>
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
