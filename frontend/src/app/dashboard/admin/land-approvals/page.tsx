"use client";

import { useState } from "react";
import LandVerificationList from "@/components/dashboard/admin/LandVerificationList";
import type { AdminLandVerification } from "@/lib/types";

// ============================================================================
// Admin Dashboard — Land Approvals Page
// ============================================================================

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
  {
    id: "ver-004",
    plotName: "Hutan Mangrove Kuala Langsa",
    landownerName: "Dewi Lestari",
    landownerEmail: "dewi.lestari@email.com",
    location: "Kuala Langsa, Aceh",
    areaHa: 80,
    vegetationType: "Mangrove",
    estimatedCarbonCredits: 2100,
    submittedAt: "2026-09-28T11:00:00Z",
    documentsCount: 4,
    status: "VERIFIED",
    documents: [
      { id: "doc-013", name: "Sertifikat Tanah.pdf", type: "LAND_TITLE", uploadedAt: "2026-09-28T11:00:00Z", fileSize: "2.8 MB", verified: true },
      { id: "doc-014", name: "Laporan Vegetasi.pdf", type: "VEGETATION_REPORT", uploadedAt: "2026-09-28T11:01:00Z", fileSize: "6.2 MB", verified: true },
      { id: "doc-015", name: "Koordinat GPS.kml", type: "GPS_COORDINATES", uploadedAt: "2026-09-28T11:02:00Z", fileSize: "189 KB", verified: true },
      { id: "doc-016", name: "KTP & NPWP.pdf", type: "IDENTITY", uploadedAt: "2026-09-28T11:03:00Z", fileSize: "1.9 MB", verified: true },
    ],
  },
  {
    id: "ver-005",
    plotName: "Lahan Gambut Berbak",
    landownerName: "Rudi Hartono",
    landownerEmail: "rudi.hartono@email.com",
    location: "Jambi",
    areaHa: 95,
    vegetationType: "Peatland",
    estimatedCarbonCredits: 2800,
    submittedAt: "2026-09-25T10:30:00Z",
    documentsCount: 3,
    status: "REJECTED",
    documents: [
      { id: "doc-017", name: "Sertifikat Tanah.pdf", type: "LAND_TITLE", uploadedAt: "2026-09-25T10:30:00Z", fileSize: "2.1 MB", verified: false },
      { id: "doc-018", name: "Laporan Vegetasi.pdf", type: "VEGETATION_REPORT", uploadedAt: "2026-09-25T10:31:00Z", fileSize: "4.5 MB", verified: false },
      { id: "doc-019", name: "KTP.pdf", type: "IDENTITY", uploadedAt: "2026-09-25T10:32:00Z", fileSize: "1.2 MB", verified: true },
    ],
  },
];

export default function LandApprovalsPage() {
  const [verifications, setVerifications] = useState(mockVerifications);

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

  const pendingCount = verifications.filter((v) => v.status === "PENDING").length;
  const verifiedCount = verifications.filter((v) => v.status === "VERIFIED").length;
  const rejectedCount = verifications.filter((v) => v.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Land Approvals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Verifikasi dan kelola pengajuan lahan dari landowner
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-700">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-800">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Verified</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-800">{verifiedCount}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-red-800">{rejectedCount}</p>
        </div>
      </div>

      {/* Verification List */}
      <LandVerificationList
        verifications={verifications}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
