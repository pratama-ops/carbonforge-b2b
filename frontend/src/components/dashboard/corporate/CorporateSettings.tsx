"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ============================================================================
// CorporateSettings — Company profile, billing, emission targets & credentials
// ============================================================================

interface CorporateSettingsProps {
  initialCompanyName: string;
  initialEmail: string;
  initialPhone: string;
  initialAddress: string;
  initialBillingEmail: string;
  initialTaxId: string;
  initialAnnualTargetTon: number;
  onSave?: (data: SettingsFormData) => Promise<void>;
}

export interface SettingsFormData {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  billingEmail: string;
  taxId: string;
  annualTargetTon: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function CorporateSettings({
  initialCompanyName,
  initialEmail,
  initialPhone,
  initialAddress,
  initialBillingEmail,
  initialTaxId,
  initialAnnualTargetTon,
  onSave,
}: CorporateSettingsProps) {
  // Company profile state
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);

  // Billing state
  const [billingEmail, setBillingEmail] = useState(initialBillingEmail);
  const [taxId, setTaxId] = useState(initialTaxId);

  // Emission target state
  const [annualTargetTon, setAnnualTargetTon] = useState(String(initialAnnualTargetTon));

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification preferences
  const [notifyMatches, setNotifyMatches] = useState(true);
  const [notifyTransactions, setNotifyTransactions] = useState(true);
  const [notifyMonthlyReport, setNotifyMonthlyReport] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          companyName,
          email,
          phone,
          address,
          billingEmail,
          taxId,
          annualTargetTon: Number(annualTargetTon),
          currentPassword,
          newPassword,
          confirmPassword,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success message */}
      {saveSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-emerald-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-emerald-800">Settings saved successfully</p>
          </div>
        </div>
      )}

      {/* Company Profile */}
      <SettingsSection
        title="Company Profile"
        description="Update your company information and contact details."
      >
        <div className="space-y-4">
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
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700"
            >
              Company Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter company address"
              rows={3}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} loading={isSaving}>
            Save Profile
          </Button>
        </div>
      </SettingsSection>

      {/* Billing Information */}
      <SettingsSection
        title="Billing Information"
        description="Manage your billing details and tax information."
      >
        <div className="space-y-4">
          <Input
            label="Billing Email"
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder="Enter billing email"
            helperText="Invoices will be sent to this address"
          />
          <Input
            label="Tax ID / NPWP"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Enter tax identification number"
            helperText="For invoice and tax purposes"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} loading={isSaving}>
            Save Billing Info
          </Button>
        </div>
      </SettingsSection>

      {/* Emission Target */}
      <SettingsSection
        title="Emission Target"
        description="Set your annual carbon emission reduction target."
      >
        <div className="space-y-4">
          <Input
            label="Annual Emission Target (tCO₂e)"
            type="number"
            value={annualTargetTon}
            onChange={(e) => setAnnualTargetTon(e.target.value)}
            placeholder="Enter annual emission target"
            helperText="Your net-zero commitment target in tonnes of CO₂ equivalent"
          />
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Current Progress</span>
              <span className="font-medium text-slate-900">28,450 / {Number(annualTargetTon).toLocaleString()} tCO₂e</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min((28450 / Number(annualTargetTon)) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {Math.round((28450 / Number(annualTargetTon)) * 100)}% of annual target achieved
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} loading={isSaving}>
            Update Target
          </Button>
        </div>
      </SettingsSection>

      {/* Notification Preferences */}
      <SettingsSection
        title="Notification Preferences"
        description="Choose what updates you want to receive."
      >
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifyMatches}
              onChange={(e) => setNotifyMatches(e.target.checked)}
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
              checked={notifyTransactions}
              onChange={(e) => setNotifyTransactions(e.target.checked)}
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
              checked={notifyMonthlyReport}
              onChange={(e) => setNotifyMonthlyReport(e.target.checked)}
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
          <Button variant="primary" onClick={handleSaveProfile} loading={isSaving}>
            Save Preferences
          </Button>
        </div>
      </SettingsSection>

      {/* Change Password */}
      <SettingsSection
        title="Account Security"
        description="Update your password to keep your account secure."
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            helperText="Must be at least 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleChangePassword} loading={isSaving}>
            Change Password
          </Button>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
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
          <Button
            variant="secondary"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
