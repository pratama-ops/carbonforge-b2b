"use client";

import { useState } from "react";
import TransactionMonitor from "@/components/dashboard/admin/TransactionMonitor";
import type { AdminTransaction } from "@/lib/types";

// ============================================================================
// Admin Dashboard — Transactions Page
// ============================================================================

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
  {
    id: "tx-2026-005",
    plotName: "Hutan Mangrove Kuala Langsa",
    landownerName: "Dewi Lestari",
    buyerName: "PT Green Energy Indonesia",
    volumeTonCO2e: 180,
    pricePerTon: 88000,
    totalAmount: 15840000,
    status: "COMPLETED",
    transactionDate: "2026-10-02T11:00:00Z",
    certificateId: "CERT-2026-003",
  },
  {
    id: "tx-2026-006",
    plotName: "Lahan Gambut Rawa Singkil",
    landownerName: "Siti Rahayu",
    buyerName: "EcoTrade International",
    volumeTonCO2e: 400,
    pricePerTon: 95000,
    totalAmount: 38000000,
    status: "COMPLETED",
    transactionDate: "2026-10-01T13:30:00Z",
    certificateId: "CERT-2026-004",
  },
  {
    id: "tx-2026-007",
    plotName: "Hutan Tropis Kalimantan Timur",
    landownerName: "Ahmad Wijaya",
    buyerName: "PT Carbon Solutions",
    volumeTonCO2e: 250,
    pricePerTon: 80000,
    totalAmount: 20000000,
    status: "PENDING",
    transactionDate: "2026-09-30T10:00:00Z",
    certificateId: null,
  },
  {
    id: "tx-2026-008",
    plotName: "Hutan Mangrove Pantai Indah",
    landownerName: "Budi Santoso",
    buyerName: "PT Carbon Solutions",
    volumeTonCO2e: 100,
    pricePerTon: 85000,
    totalAmount: 8500000,
    status: "COMPLETED",
    transactionDate: "2026-09-28T15:00:00Z",
    certificateId: "CERT-2026-005",
  },
];

export default function TransactionsPage() {
  const [transactions] = useState(mockTransactions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor dan audit seluruh transaksi di platform CarbonForge
        </p>
      </div>

      {/* Transaction Monitor */}
      <TransactionMonitor transactions={transactions} />
    </div>
  );
}
