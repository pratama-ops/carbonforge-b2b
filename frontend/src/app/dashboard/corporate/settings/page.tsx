"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ============================================================================
// Corporate Dashboard — Settings page
// ============================================================================

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("PT Carbon Solutions Indonesia");
  const [email, setEmail] = useState("buyer@carbonforge.id");
  const [targetEmission, setTargetEmission] = useState("50000");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
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

      {/* Company profile */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Company Profile</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your company information and contact details.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
          <Input
            label="Annual Emission Target (tCO₂e)"
            type="number"
            value={targetEmission}
            onChange={(e) => setTargetEmission(e.target.value)}
            placeholder="Enter annual emission target"
            helperText="Your net-zero commitment target in tonnes of CO₂ equivalent"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose what updates you want to receive.
        </p>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">New matchmaking recommendations</p>
              <p className="text-sm text-slate-500">
                Get notified when new land plots match your criteria
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Transaction updates</p>
              <p className="text-sm text-slate-500">
                Receive updates on your carbon credit purchases
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Monthly portfolio report</p>
              <p className="text-sm text-slate-500">
                Get a monthly summary of your carbon offset progress
              </p>
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-500">
          Irreversible and destructive actions.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Delete account</p>
            <p className="text-sm text-slate-500">
              Permanently delete your corporate account and all data
            </p>
          </div>
          <Button variant="secondary" className="border-red-300 text-red-700 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
