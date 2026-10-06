"use client";

import { useState } from "react";
import type { AdminTransaction, TransactionStatus } from "@/lib/types";

// ============================================================================
// TransactionMonitor — Platform-wide transaction audit table
// ============================================================================

const statusConfig: Record<TransactionStatus, { bg: string; text: string; dot: string; label: string }> = {
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "In Escrow" },
  FAILED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Failed" },
};

interface TransactionMonitorProps {
  transactions: AdminTransaction[];
}

export default function TransactionMonitor({ transactions }: TransactionMonitorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "ALL">("ALL");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.plotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.landownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.volumeTonCO2e, 0);
  const totalValue = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const completedCount = transactions.filter((tx) => tx.status === "COMPLETED").length;
  const pendingCount = transactions.filter((tx) => tx.status === "PENDING").length;
  const failedCount = transactions.filter((tx) => tx.status === "FAILED").length;

  return (
    <div className="space-y-4">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Total Volume</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{totalVolume.toLocaleString("id-ID")} t</p>
          <p className="text-xs text-slate-500">Ton CO2e</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-700">Total Nilai</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-800">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-emerald-600">IDR</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-blue-800">{completedCount}</p>
          <p className="text-xs text-blue-600">transaksi</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-700">In Escrow</p>
          <p className="mt-1 text-2xl font-semibold text-amber-800">{pendingCount}</p>
          <p className="text-xs text-amber-600">pending</p>
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
            placeholder="Cari ID transaksi, lahan, pihak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | "ALL")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">In Escrow</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">ID Transaksi</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Lahan</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Landowner</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Volume</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Harga/t</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Total Nilai</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const status = statusConfig[tx.status];
              return (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-slate-600">{tx.id.slice(0, 12)}...</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{tx.plotName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.landownerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.buyerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.volumeTonCO2e.toLocaleString("id-ID")} t</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(tx.pricePerTon)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(tx.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(tx.transactionDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-500">Tidak ada transaksi yang cocok dengan filter</p>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
      </p>
    </div>
  );
}
