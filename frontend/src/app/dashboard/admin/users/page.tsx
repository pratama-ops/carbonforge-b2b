"use client";

import { useState } from "react";
import UserManagementTable from "@/components/dashboard/admin/UserManagementTable";
import type { AdminUser, AdminUserRole, AdminUserStatus } from "@/lib/types";

// ============================================================================
// Admin Dashboard — User Management Page
// ============================================================================

const mockUsers: AdminUser[] = [
  {
    id: "usr-001",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    role: "LANDOWNER",
    status: "ACTIVE",
    registeredAt: "2026-08-15T08:00:00Z",
    lastActiveAt: "2026-10-05T10:30:00Z",
    totalTransactions: 12,
    totalVolumeTonCO2e: 1800,
  },
  {
    id: "usr-002",
    name: "Siti Rahayu",
    email: "siti.rahayu@email.com",
    role: "LANDOWNER",
    status: "ACTIVE",
    registeredAt: "2026-08-20T09:00:00Z",
    lastActiveAt: "2026-10-04T14:15:00Z",
    totalTransactions: 8,
    totalVolumeTonCO2e: 2400,
  },
  {
    id: "usr-003",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@email.com",
    role: "LANDOWNER",
    status: "PENDING_VERIFICATION",
    registeredAt: "2026-10-01T10:00:00Z",
    lastActiveAt: "2026-10-02T09:00:00Z",
    totalTransactions: 0,
    totalVolumeTonCO2e: 0,
  },
  {
    id: "usr-004",
    name: "PT Green Energy Indonesia",
    email: "contact@greenenergy.co.id",
    role: "CORPORATE_BUYER",
    status: "ACTIVE",
    registeredAt: "2026-07-10T08:00:00Z",
    lastActiveAt: "2026-10-05T09:00:00Z",
    totalTransactions: 25,
    totalVolumeTonCO2e: 8500,
  },
  {
    id: "usr-005",
    name: "PT Carbon Solutions",
    email: "info@carbonsolutions.com",
    role: "CORPORATE_BUYER",
    status: "ACTIVE",
    registeredAt: "2026-07-15T09:00:00Z",
    lastActiveAt: "2026-10-03T11:00:00Z",
    totalTransactions: 18,
    totalVolumeTonCO2e: 6200,
  },
  {
    id: "usr-006",
    name: "EcoTrade International",
    email: "procurement@ecotrade.int",
    role: "CORPORATE_BUYER",
    status: "SUSPENDED",
    registeredAt: "2026-06-20T10:00:00Z",
    lastActiveAt: "2026-09-15T16:00:00Z",
    totalTransactions: 5,
    totalVolumeTonCO2e: 1200,
  },
  {
    id: "usr-007",
    name: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    role: "LANDOWNER",
    status: "ACTIVE",
    registeredAt: "2026-09-01T08:00:00Z",
    lastActiveAt: "2026-10-01T11:00:00Z",
    totalTransactions: 3,
    totalVolumeTonCO2e: 600,
  },
  {
    id: "usr-008",
    name: "Rudi Hartono",
    email: "rudi.hartono@email.com",
    role: "LANDOWNER",
    status: "SUSPENDED",
    registeredAt: "2026-08-05T09:00:00Z",
    lastActiveAt: "2026-09-20T10:30:00Z",
    totalTransactions: 2,
    totalVolumeTonCO2e: 400,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);

  const handleToggleStatus = (userId: string, currentStatus: AdminUserStatus) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus: AdminUserStatus =
          currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        return { ...u, status: newStatus };
      })
    );
  };

  const handleUpdateRole = (userId: string, newRole: AdminUserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola seluruh pengguna platform CarbonForge
        </p>
      </div>

      {/* User Table */}
      <UserManagementTable
        users={users}
        onToggleStatus={handleToggleStatus}
        onUpdateRole={handleUpdateRole}
        onDelete={handleDelete}
      />
    </div>
  );
}
