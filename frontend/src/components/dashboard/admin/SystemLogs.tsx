"use client";

import { useState } from "react";
import type { AdminSystemLog } from "@/lib/types";

// ============================================================================
// SystemLogs — Audit trail for platform events
// ============================================================================

const levelConfig: Record<AdminSystemLog["level"], { bg: string; text: string; border: string; label: string }> = {
  INFO: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "INFO" },
  WARNING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "WARN" },
  ERROR: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "ERROR" },
  CRITICAL: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", label: "SECURITY" },
};

const categoryLabels: Record<AdminSystemLog["category"], string> = {
  AUTH: "Autentikasi",
  VERIFICATION: "Verifikasi",
  TRANSACTION: "Transaksi",
  USER_MANAGEMENT: "Manajemen User",
  SYSTEM: "Sistem",
};

interface SystemLogsProps {
  logs: AdminSystemLog[];
}

export default function SystemLogs({ logs }: SystemLogsProps) {
  const [levelFilter, setLevelFilter] = useState<AdminSystemLog["level"] | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<AdminSystemLog["category"] | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    const matchesCategory = categoryFilter === "ALL" || log.category === categoryFilter;
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
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
            placeholder="Cari pesan atau user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as AdminSystemLog["level"] | "ALL")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Level</option>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARN</option>
          <option value="ERROR">ERROR</option>
          <option value="CRITICAL">SECURITY</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as AdminSystemLog["category"] | "ALL")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Kategori</option>
          <option value="AUTH">Autentikasi</option>
          <option value="VERIFICATION">Verifikasi</option>
          <option value="TRANSACTION">Transaksi</option>
          <option value="USER_MANAGEMENT">Manajemen User</option>
          <option value="SYSTEM">Sistem</option>
        </select>
      </div>

      {/* Log entries */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const level = levelConfig[log.level];
          return (
            <div
              key={log.id}
              className={`rounded-lg border ${level.border} ${level.bg} px-4 py-3`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 inline-flex rounded px-1.5 py-0.5 text-xs font-semibold ${level.text} ${level.bg} border ${level.border}`}>
                    {level.label}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${level.text}`}>{log.message}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded bg-white/60 px-1.5 py-0.5">{categoryLabels[log.category]}</span>
                      {log.userName && (
                        <span>
                          oleh <span className="font-medium text-slate-700">{log.userName}</span>
                        </span>
                      )}
                      {log.metadata && Object.entries(log.metadata).length > 0 && (
                        <span className="font-mono text-slate-400">
                          {JSON.stringify(log.metadata)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <time className="block text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </time>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    IP: {log.metadata?.ipAddress || "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">Tidak ada log yang cocok dengan filter</p>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Menampilkan {filteredLogs.length} dari {logs.length} log
      </p>
    </div>
  );
}
