"use client";

import { useState } from "react";
import SystemLogs from "@/components/dashboard/admin/SystemLogs";
import type { AdminSystemLog } from "@/lib/types";

// ============================================================================
// Admin Dashboard — System Logs Page
// ============================================================================

const mockLogs: AdminSystemLog[] = [
  {
    id: "log-001",
    timestamp: "2026-10-05T14:20:00Z",
    level: "INFO",
    category: "TRANSACTION",
    message: "Transaksi tx-2026-002 berhasil dibuat oleh PT Carbon Solutions",
    userId: "usr-005",
    userName: "PT Carbon Solutions",
    metadata: { transactionId: "tx-2026-002", amount: 27600000, ipAddress: "203.0.113.42" },
  },
  {
    id: "log-002",
    timestamp: "2026-10-05T10:30:00Z",
    level: "INFO",
    category: "VERIFICATION",
    message: "Lahan Hutan Mangrove Pantai Indah disetujui oleh admin",
    userId: "usr-001",
    userName: "Budi Santoso",
    metadata: { plotName: "Hutan Mangrove Pantai Indah", verificationId: "ver-001", ipAddress: "192.168.1.100" },
  },
  {
    id: "log-003",
    timestamp: "2026-10-05T09:15:00Z",
    level: "WARNING",
    category: "AUTH",
    message: "Percobaan login gagal 3 kali berturut-turut untuk email rudi.hartono@email.com",
    userId: "usr-008",
    userName: "Rudi Hartono",
    metadata: { attemptCount: 3, ipAddress: "203.0.113.99" },
  },
  {
    id: "log-004",
    timestamp: "2026-10-04T16:45:00Z",
    level: "ERROR",
    category: "TRANSACTION",
    message: "Transaksi tx-2026-004 gagal: saldo tidak mencukupi",
    userId: "usr-004",
    userName: "PT Green Energy Indonesia",
    metadata: { transactionId: "tx-2026-004", reason: "INSUFFICIENT_BALANCE", ipAddress: "198.51.100.23" },
  },
  {
    id: "log-005",
    timestamp: "2026-10-04T11:00:00Z",
    level: "INFO",
    category: "USER_MANAGEMENT",
    message: "Akun Dewi Lestari berhasil diverifikasi dan diaktifkan",
    userId: "usr-007",
    userName: "Dewi Lestari",
    metadata: { previousStatus: "PENDING_VERIFICATION", newStatus: "ACTIVE", ipAddress: "192.168.1.105" },
  },
  {
    id: "log-006",
    timestamp: "2026-10-03T14:15:00Z",
    level: "INFO",
    category: "VERIFICATION",
    message: "Pengajuan lahan baru: Lahan Gambut Rawa Singkil oleh Siti Rahayu",
    userId: "usr-002",
    userName: "Siti Rahayu",
    metadata: { verificationId: "ver-002", plotName: "Lahan Gambut Rawa Singkil", ipAddress: "203.0.113.55" },
  },
  {
    id: "log-007",
    timestamp: "2026-10-02T09:00:00Z",
    level: "CRITICAL",
    category: "SYSTEM",
    message: "Pembayaran webhook timeout untuk transaksi tx-2026-007",
    userId: null,
    userName: null,
    metadata: { transactionId: "tx-2026-007", timeout: 30000, ipAddress: "10.0.0.1" },
  },
  {
    id: "log-008",
    timestamp: "2026-10-01T13:30:00Z",
    level: "INFO",
    category: "TRANSACTION",
    message: "Sertifikat karbon CERT-2026-004 diterbitkan untuk transaksi tx-2026-006",
    userId: "usr-006",
    userName: "EcoTrade International",
    metadata: { transactionId: "tx-2026-006", certificateId: "CERT-2026-004", ipAddress: "198.51.100.100" },
  },
  {
    id: "log-009",
    timestamp: "2026-09-30T10:00:00Z",
    level: "WARNING",
    category: "USER_MANAGEMENT",
    message: "Akun EcoTrade International di-suspend karena pelanggaran kebijakan",
    userId: "usr-006",
    userName: "EcoTrade International",
    metadata: { reason: "POLICY_VIOLATION", suspendedBy: "admin", ipAddress: "192.168.1.100" },
  },
  {
    id: "log-010",
    timestamp: "2026-09-28T15:00:00Z",
    level: "INFO",
    category: "AUTH",
    message: "Pengguna baru terdaftar: Rudi Hartono (Landowner)",
    userId: "usr-008",
    userName: "Rudi Hartono",
    metadata: { role: "LANDOWNER", registrationMethod: "EMAIL", ipAddress: "203.0.113.77" },
  },
];

export default function SystemLogsPage() {
  const [logs] = useState(mockLogs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">System Logs</h1>
        <p className="mt-1 text-sm text-slate-500">
          Audit trail dan monitoring event platform
        </p>
      </div>

      {/* Logs */}
      <SystemLogs logs={logs} />
    </div>
  );
}
