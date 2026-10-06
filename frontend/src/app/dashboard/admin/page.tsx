"use client";

import { useState } from "react";
import AdminStats from "@/components/dashboard/admin/AdminStats";
import LandVerificationList from "@/components/dashboard/admin/LandVerificationList";
import TransactionMonitor from "@/components/dashboard/admin/TransactionMonitor";
import type { AdminPlatformStats, AdminLandVerification, AdminTransaction } from "@/lib/types";

// ============================================================================
// Admin Dashboard — Overview Page
// ============================================================================

const mockStats: AdminPlatformStats = {
  totalLandRegistered: 156,
  totalVolumeCarbonTonCO2e: 45230,
  totalActiveUsers: 89,
  totalSuccessfulTransactions: 342,
  pendingVerifications: 12,
  totalRevenue: 2847500000,
};

const mockVerifications: AdminLandVerification[] = [
  {
    id: "ver-001",
    plotName: "Hutan Mangrove Pantai Indah",
    landownerName: "Budi Santoso",
    landownerEmail: "budi.santoso@email.com",
    location: "Pesisir Selatan, Sumatera Barat",
    areaHa: 45,
    vegetationType: "Mangrove",
    estimatedCarbonCredits: 1250,
    submittedAt: "2026-10-04T08:30:00Z",
    documentsCount: 4,
    status: "PENDING",
    documents: [
      { id: "doc-001", name: "Sertifikat Tanah HGU.pdf", type: "LAND_TITLE", uploadedAt: "2026-10-04T08:30:00Z", fileSize: "2.4 MB", verified: true },
      { id: "doc-002", name: "Laporan Vegetasi Q3 2026.pdf", type: "VEGETATION_REPORT", uploadedAt: "2026-10-04T08:31:00Z", fileSize: "5.1 MB", verified: false },
      { id: "doc-003", name: "Koordinat GPS Lahan.kml", type: "GPS_COORDINATES", uploadedAt: "2026-10-04T08:32:00Z", fileSize: "156 KB", verified: true },
      { id: "doc-004", name: "KTP & NPWP.pdf", type: "IDENTITY", uploadedAt: "2026-10-04T08:33:00Z", fileSize: "1.8 MB", verified: true },
    ],
  },
  {
    id: "ver-002",
    plotName: "Lahan Gambut Rawa Singkil",
    landownerName: "Siti Rahayu",
    landownerEmail: "siti.rahayu@email.com",
    location: "Rawa Singkil, Aceh",
    areaHa: 120,
    vegetationType: "Peatland",
    estimatedCarbonCredits: 3400,
    submittedAt: "2026-10-03T14:15:00Z",
    documentsCount: 3,
    status: "PENDING",
    documents: [
      { id: "doc-005", name: "Sertifikat Tanah.pdf", type: "LAND_TITLE", uploadedAt: "2026-10-03T14:15:00Z", fileSize: "3.2 MB", verified: true },
      { id: "doc-006", name: "Laporan Keanekaragaman Hayati.pdf", type: "VEGETATION_REPORT", uploadedAt: "2026-10-03T14:16:00Z", fileSize: "8.7 MB", verified: false },
      { id: "doc-007", name: "Dokumen Pendukung.pdf", type: "OTHER", uploadedAt: "2026-10-03T14:17:00Z", fileSize: "1.1 MB", verified: false },
    ],
  },
  {
    id: "ver-003",
    plotName: "Hutan Tropis Kalimantan Timur",
    landownerName: "Ahmad Wijaya",
    landownerEmail: "ahmad.wijaya@email.com",
    location: "Kutai Timur, Kalimantan Timur",
    areaHa: 200,
    vegetationType: "Tropical Rainforest",
    estimatedCarbonCredits: 5600,
    submittedAt: "2026-10-02T09:00:00Z",
    documentsCount: 5,
    status: "PENDING",
    documents: [
      { id: "doc-008", name: "Sertifikat HGU.pdf", type: "LAND_TITLE", uploadedAt: "2026-10-02T09:00:00Z", fileSize: "4.1 MB", verified: true },
      { id: "doc-009", name: "Laporan Vegetasi Tahunan.pdf", type: "VEGETATION_REPORT", uploadedAt: "2026-10-02T09:01:00Z", fileSize: "12.3 MB", verified: true },
      { id: "doc-010", name: "Koordinat GPS.kml", type: "GPS_COORDINATES", uploadedAt: "2026-10-02T09:02:00Z", fileSize: "234 KB", verified: true },
      { id: "doc-011", name: "KTP & NPWP.pdf", type: "IDENTITY", uploadedAt: "2026-10-02T09:03:00Z", fileSize: "2.0 MB", verified: true },
      { id: "doc-012", name: "Izin Usaha.pdf", type: "OTHER", uploadedAt: "2026-10-02T09:04:00Z", fileSize: "1.5 MB", verified: true },
    ],
  },
];

const mockTransactions: AdminTransaction[] = [
  {
    id: "tx-2026-001",
    plotName: "Hutan Mangrove Pantai Indah",
    landownerName: "Budi Santoso",
    buyerName: "PT Green Energy Indonesia",
    volumeTonCO2e: 150,
    pricePerTon: 85000,
    totalAmount: 12750000,
    status: "COMPLETED",
    transactionDate: "2026-10-05T10:30:00Z",
    certificateId: "CERT-2026-001",
  },
  {
    id: "tx-2026-002",
    plotName: "Lahan Gambut Rawa Singkil",
    landownerName: "Siti Rahayu",
    buyerName: "PT Carbon Solutions",
    volumeTonCO2e: 300,
    pricePerTon: 92000,
    totalAmount: 27600000,
    status: "PENDING",
    transactionDate: "2026-10-05T14:20:00Z",
    certificateId: null,
  },
  {
    id: "tx-2026-003",
    plotName: "Hutan Tropis Kalimantan Timur",
    landownerName: "Ahmad Wijaya",
    buyerName: "EcoTrade International",
    volumeTonCO2e: 500,
    pricePerTon: 78000,
    totalAmount: 39000000,
    status: "COMPLETED",
    transactionDate: "2026-10-04T09:15:00Z",
    certificateId: "CERT-2026-002",
  },
  {
    id: "tx-2026-004",
    plotName: "Hutan Mangrove Pantai Indah",
    landownerName: "Budi Santoso",
    buyerName: "PT Green Energy Indonesia",
    volumeTonCO2e: 200,
    pricePerTon: 85000,
    totalAmount: 17000000,
    status: "FAILED",
    transactionDate: "2026-10-03T16:45:00Z",
    certificateId: null,
  },
];

export default function AdminOverviewPage() {
  const [verifications, setVerifications] = useState(mockVerifications);
  const [transactions] = useState(mockTransactions);

  const handleApprove = (id: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "VERIFIED" as const } : v))
    );
  };

  const handleReject = (id: string, _reason: string) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "REJECTED" as const } : v))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau keseluruhan aktivitas platform CarbonForge
        </p>
      </div>

      {/* Platform Stats */}
      <AdminStats stats={mockStats} />

      {/* Pending Verifications */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Pengajuan Lahan Pending</h2>
            <p className="text-sm text-slate-500">Verifikasi dokumen dan data lahan landowner</p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            {verifications.filter((v) => v.status === "PENDING").length} pending
          </span>
        </div>
        <LandVerificationList
          verifications={verifications.filter((v) => v.status === "PENDING")}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Transaksi Terbaru</h2>
          <p className="text-sm text-slate-500">Monitor seluruh transaksi di platform</p>
        </div>
        <TransactionMonitor transactions={transactions} />
      </section>
    </div>
  );
}
