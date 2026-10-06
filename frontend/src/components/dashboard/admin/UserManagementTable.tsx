"use client";

import { useState } from "react";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/lib/types";
import Button from "@/components/ui/Button";

// ============================================================================
// UserManagementTable — Table for managing platform users
// ============================================================================

const roleLabels: Record<AdminUserRole, string> = {
  LANDOWNER: "Landowner",
  CORPORATE_BUYER: "Corporate Buyer",
  ADMIN: "Admin",
};

const roleBadgeStyles: Record<AdminUserRole, string> = {
  LANDOWNER: "bg-emerald-50 text-emerald-700",
  CORPORATE_BUYER: "bg-blue-50 text-blue-700",
  ADMIN: "bg-purple-50 text-purple-700",
};

const statusConfig: Record<AdminUserStatus, { bg: string; text: string; dot: string; label: string }> = {
  ACTIVE: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Aktif" },
  SUSPENDED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Suspended" },
  PENDING_VERIFICATION: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
};

interface UserManagementTableProps {
  users: AdminUser[];
  onToggleStatus: (userId: string, currentStatus: AdminUserStatus) => void;
  onUpdateRole: (userId: string, newRole: AdminUserRole) => void;
  onDelete: (userId: string) => void;
}

export default function UserManagementTable({
  users,
  onToggleStatus,
  onUpdateRole,
  onDelete,
}: UserManagementTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = async (userId: string, currentStatus: AdminUserStatus) => {
    setActionLoading(userId);
    await new Promise((r) => setTimeout(r, 600));
    onToggleStatus(userId, currentStatus);
    setActionLoading(null);
  };

  const handleRoleChange = async (userId: string, newRole: AdminUserRole) => {
    setActionLoading(userId);
    await new Promise((r) => setTimeout(r, 600));
    onUpdateRole(userId, newRole);
    setActionLoading(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(userToDelete.id);
    await new Promise((r) => setTimeout(r, 600));
    onDelete(userToDelete.id);
    setActionLoading(null);
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const openDeleteModal = (user: AdminUser) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Statistics
  const totalUsers = users.length;
  const landowners = users.filter((u) => u.role === "LANDOWNER").length;
  const corporates = users.filter((u) => u.role === "CORPORATE_BUYER").length;
  const pendingVerification = users.filter((u) => u.status === "PENDING_VERIFICATION").length;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Total Pengguna</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Landowners</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-800">{landowners}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Corporates</p>
          <p className="mt-1 text-2xl font-semibold text-blue-800">{corporates}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-700">Pending Verification</p>
          <p className="mt-1 text-2xl font-semibold text-amber-800">{pendingVerification}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as AdminUserRole | "ALL")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Role</option>
          <option value="LANDOWNER">Landowner</option>
          <option value="CORPORATE_BUYER">Corporate Buyer</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AdminUserStatus | "ALL")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PENDING_VERIFICATION">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Pengguna</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Terdaftar</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Transaksi</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Volume</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const status = statusConfig[user.status];
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AdminUserRole)}
                      disabled={user.role === "ADMIN" || actionLoading === user.id}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border-0 ${roleBadgeStyles[user.role]} disabled:opacity-50`}
                    >
                      <option value="LANDOWNER">Landowner</option>
                      <option value="CORPORATE_BUYER">Corporate Buyer</option>
                      {user.role === "ADMIN" && <option value="ADMIN">Admin</option>}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(user.registeredAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.totalTransactions}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.totalVolumeTonCO2e.toLocaleString("id-ID")} t</td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "ADMIN" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant={user.status === "ACTIVE" ? "secondary" : "primary"}
                          size="sm"
                          loading={actionLoading === user.id}
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          {user.status === "ACTIVE" ? "Suspend" : "Aktifkan"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">Tidak ada pengguna yang cocok dengan filter</p>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Menampilkan {filteredUsers.length} dari {users.length} pengguna
      </p>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={closeDeleteModal}>
          <div
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 id="delete-title" className="text-lg font-semibold text-slate-900">
                Hapus Pengguna
              </h2>
              <button
                onClick={closeDeleteModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">
                Apakah Anda yakin ingin menghapus pengguna <span className="font-medium text-slate-900">{userToDelete.name}</span>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button variant="ghost" onClick={closeDeleteModal}>
                Batal
              </Button>
              <Button
                variant="primary"
                loading={actionLoading === userToDelete.id}
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
              >
                Hapus Pengguna
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
