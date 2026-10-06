"use client";

import { useState } from "react";
import type { AdminLandVerification, AdminDocument } from "@/lib/types";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Button from "@/components/ui/Button";

// ============================================================================
// LandVerificationList — Table for land approval workflow
// ============================================================================

const documentTypeLabels: Record<AdminDocument["type"], string> = {
  LAND_TITLE: "Sertifikat Lahan",
  VEGETATION_REPORT: "Laporan Vegetasi",
  GPS_COORDINATES: "Koordinat GPS",
  IDENTITY: "Identitas",
  OTHER: "Lainnya",
};

interface LandVerificationListProps {
  verifications: AdminLandVerification[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function LandVerificationList({
  verifications,
  onApprove,
  onReject,
}: LandVerificationListProps) {
  const [selectedVerification, setSelectedVerification] = useState<AdminLandVerification | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "VERIFIED" | "REJECTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVerifications = verifications.filter((v) => {
    const matchesSearch =
      v.plotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.landownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 800));
    onApprove(id);
    setActionLoading(null);
    setSelectedVerification(null);
  };

  const handleReject = async () => {
    if (!selectedVerification || !rejectReason.trim()) return;
    setActionLoading(selectedVerification.id);
    await new Promise((r) => setTimeout(r, 800));
    onReject(selectedVerification.id, rejectReason);
    setActionLoading(null);
    setRejectModalOpen(false);
    setRejectReason("");
    setSelectedVerification(null);
  };

  const openRejectModal = (verification: AdminLandVerification) => {
    setSelectedVerification(verification);
    setRejectModalOpen(true);
  };

  const closeModals = () => {
    setSelectedVerification(null);
    setRejectModalOpen(false);
    setRejectReason("");
  };

  const pendingCount = verifications.filter((v) => v.status === "PENDING").length;
  const verifiedCount = verifications.filter((v) => v.status === "VERIFIED").length;
  const rejectedCount = verifications.filter((v) => v.status === "REJECTED").length;

  return (
    <div className="space-y-4">
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
            placeholder="Cari nama lahan, pemilik, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PENDING" | "VERIFIED" | "REJECTED")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {filteredVerifications.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-sm font-medium text-slate-500">Tidak ada pengajuan lahan yang cocok dengan filter</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lahan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Landowner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Luas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Estimasi Karbon</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dokumen</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVerifications.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{v.plotName}</p>
                      <p className="text-xs text-slate-500">{v.vegetationType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{v.landownerName}</p>
                      <p className="text-xs text-slate-500">{v.landownerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.areaHa.toLocaleString("id-ID")} ha</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.estimatedCarbonCredits.toLocaleString("id-ID")} kredit</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                      <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      {v.documentsCount} file
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVerification(v)}
                      >
                        Review
                      </Button>
                      {v.status === "PENDING" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            loading={actionLoading === v.id}
                            onClick={() => handleApprove(v.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openRejectModal(v)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-slate-500">
        Menampilkan {filteredVerifications.length} dari {verifications.length} pengajuan
      </p>

      {/* Document Review Modal */}
      {selectedVerification && !rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={closeModals}>
          <div
            className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 id="review-title" className="text-lg font-semibold text-slate-900">
                  Review Dokumen — {selectedVerification.plotName}
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedVerification.landownerName} · {selectedVerification.location}
                </p>
              </div>
              <button
                onClick={closeModals}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">Luas Lahan</p>
                  <p className="text-sm font-medium text-slate-900">{selectedVerification.areaHa.toLocaleString("id-ID")} ha</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Vegetasi</p>
                  <p className="text-sm font-medium text-slate-900">{selectedVerification.vegetationType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Estimasi Karbon</p>
                  <p className="text-sm font-medium text-slate-900">{selectedVerification.estimatedCarbonCredits.toLocaleString("id-ID")} kredit</p>
                </div>
              </div>

              <h3 className="mb-3 text-sm font-semibold text-slate-900">Dokumen Pendukung ({selectedVerification.documents.length})</h3>
              <div className="space-y-2">
                {selectedVerification.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                        <p className="text-xs text-slate-500">
                          {documentTypeLabels[doc.type]} · {doc.fileSize}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${doc.verified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {doc.verified ? "Terverifikasi" : "Belum"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedVerification.status === "PENDING" && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <Button variant="secondary" onClick={() => openRejectModal(selectedVerification)}>
                  Reject
                </Button>
                <Button
                  variant="primary"
                  loading={actionLoading === selectedVerification.id}
                  onClick={() => handleApprove(selectedVerification.id)}
                >
                  Approve Lahan
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={closeModals}>
          <div
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 id="reject-title" className="text-lg font-semibold text-slate-900">
                Reject Pengajuan
              </h2>
              <button
                onClick={closeModals}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <p className="mb-4 text-sm text-slate-600">
                Berikan alasan penolakan untuk <span className="font-medium text-slate-900">{selectedVerification.plotName}</span>. 
                Landowner akan menerima notifikasi dengan alasan ini.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Dokumen sertifikat lahan tidak lengkap, mohon unggah ulang..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <Button variant="ghost" onClick={closeModals}>
                Batal
              </Button>
              <Button
                variant="primary"
                loading={actionLoading === selectedVerification.id}
                disabled={!rejectReason.trim()}
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
              >
                Reject Pengajuan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
