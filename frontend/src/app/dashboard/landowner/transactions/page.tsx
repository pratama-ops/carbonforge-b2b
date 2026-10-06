"use client";

import { useState, useMemo } from "react";
import type { LandownerTransaction, LandownerTransactionStatus } from "@/lib/types";

// ============================================================================
// Landowner Dashboard — Transactions page
// ============================================================================

const mockTransactions: LandownerTransaction[] = [
  {
    id: "TXN-2025-001",
    buyerName: "PT Carbon Solutions Indonesia",
    plotName: "North Mangrove Reserve",
    volumeTonCO2e: 5000,
    pricePerTon: 45.5,
    totalAmount: 227500,
    status: "COMPLETED",
    transactionDate: "2025-09-15T10:00:00Z",
  },
  {
    id: "TXN-2025-002",
    buyerName: "GreenTech Corporation",
    plotName: "Tropical Forest Corridor",
    volumeTonCO2e: 3200,
    pricePerTon: 52.0,
    totalAmount: 166400,
    status: "COMPLETED",
    transactionDate: "2025-08-28T09:15:00Z",
  },
  {
    id: "TXN-2025-003",
    buyerName: "EcoVentures Ltd",
    plotName: "Peatland Restoration Area",
    volumeTonCO2e: 8000,
    pricePerTon: 38.0,
    totalAmount: 304000,
    status: "PROCESSING",
    transactionDate: "2025-10-01T16:45:00Z",
  },
  {
    id: "TXN-2025-004",
    buyerName: "Sustainable Futures Inc",
    plotName: "Delta Wetland Reserve",
    volumeTonCO2e: 2500,
    pricePerTon: 42.0,
    totalAmount: 105000,
    status: "COMPLETED",
    transactionDate: "2025-07-20T13:30:00Z",
  },
  {
    id: "TXN-2025-005",
    buyerName: "Carbon Neutral Holdings",
    plotName: "Coastal Mangrove Belt",
    volumeTonCO2e: 4200,
    pricePerTon: 35.0,
    totalAmount: 147000,
    status: "COMPLETED",
    transactionDate: "2025-05-05T08:00:00Z",
  },
  {
    id: "TXN-2025-006",
    buyerName: "PT Hijau Nusantara",
    plotName: "Highland Rainforest Plot",
    volumeTonCO2e: 1800,
    pricePerTon: 48.0,
    totalAmount: 86400,
    status: "PROCESSING",
    transactionDate: "2025-10-03T11:20:00Z",
  },
];

type StatusFilter = "ALL" | LandownerTransactionStatus;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PROCESSING", label: "Processing" },
];

const statusConfig: Record<LandownerTransactionStatus, { bg: string; text: string; dot: string }> = {
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  PROCESSING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
};

export default function TransactionsPage() {
  const [transactions] = useState<LandownerTransaction[]>(mockTransactions);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== "ALL" && tx.status !== statusFilter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.id.toLowerCase().includes(query) ||
          tx.buyerName.toLowerCase().includes(query) ||
          tx.plotName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [transactions, statusFilter, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Transaction History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track carbon credit sales and incoming offers from corporate buyers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by ID, buyer, or plot name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          aria-label="Filter by status"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Transaction ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Buyer Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Plot Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Volume
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Price/Ton
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Total Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => {
                const config = statusConfig[tx.status];
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {tx.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {tx.buyerName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {tx.plotName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {tx.volumeTonCO2e.toLocaleString()} tCO₂e
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                      {formatCurrency(tx.pricePerTon)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {formatCurrency(tx.totalAmount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
                        {tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {formatDate(tx.transactionDate)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="h-12 w-12 text-slate-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-slate-900">No transactions found</p>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-500">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>
    </div>
  );
}
