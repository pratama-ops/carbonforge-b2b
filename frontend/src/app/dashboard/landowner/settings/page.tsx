"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// ============================================================================
// Landowner Dashboard — Settings page
// ============================================================================

export default function SettingsPage() {
  const [name, setName] = useState("Budi Santoso");
  const [email, setEmail] = useState("landowner@carbonforge.id");
  const [phone, setPhone] = useState("+62 812-3456-7890");
  const [walletAddress, setWalletAddress] = useState("0x1234...abcd");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    // TODO: Implement save logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingProfile(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setIsSavingPassword(true);
    // TODO: Implement password change logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSavingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your landowner profile and account preferences.
        </p>
      </div>

      {/* Profile information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your personal information and contact details.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
          />
          <Input
            label="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address for fund disbursement"
            helperText="This wallet will receive payments from carbon credit sales"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} loading={isSavingProfile}>
            Save Profile
          </Button>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your password to keep your account secure.
        </p>

        <div className="mt-6 space-y-4">
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
          <Button variant="primary" onClick={handleChangePassword} loading={isSavingPassword}>
            Change Password
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
              <p className="text-sm font-medium text-slate-900">New purchase offers</p>
              <p className="text-sm text-slate-500">
                Get notified when a corporate buyer wants to purchase your carbon credits
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
              <p className="text-sm font-medium text-slate-900">Verification updates</p>
              <p className="text-sm text-slate-500">
                Receive updates on your land plot verification status
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Payment notifications</p>
              <p className="text-sm text-slate-500">
                Get notified when payments are processed to your wallet
              </p>
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveProfile} loading={isSavingProfile}>
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
              Permanently delete your landowner account and all data
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
