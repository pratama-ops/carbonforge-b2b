"use client";

import { useState } from "react";
import TransactionTable from "@/components/dashboard/corporate/TransactionTable";
import type { CorporateTransaction } from "@/lib/types";

// ============================================================================
// Corporate Dashboard — Transactions page
// ============================================================================

const mockTransactions: CorporateTransaction[] = [
  {
    id: "1",
    plotName: "North Mangrove Reserve",
    landownerName: "Budi Santoso",
    volumeTonCO2e: 5000,
    pricePerTon: 45.5,
    totalAmount: 227500,
    status: "COMPLETED",
    transactionDate: "2025-09-15T10:00:00Z",
    certificateDate: "2025-09-20T14:30:00Z",
    certificateId: "CF-2025-001",
  },
  {
    id: "2",
    plotName: "Tropical Forest Corridor",
    landownerName: "Ahmad Wijaya",
    volumeTonCO2e: 3200,
    pricePerTon: 52.0,
    totalAmount: 166400,
    status: "COMPLETED",
    transactionDate: "2025-08-28T09:15:00Z",
    certificateDate: "2025-09-02T11:00:00Z",
    certificateId: "CF-2025-002",
  },
  {
    id: "3",
    plotName: "Peatland Restoration Area",
    landownerName: "Siti Rahayu",
    volumeTonCO2e: 8000,
    pricePerTon: 38.0,
    totalAmount: 304000,
    status: "PENDING",
    transactionDate: "2025-10-01T16:45:00Z",
    certificateDate: "2025-10-05T10:00:00Z",
    certificateId: "CF-2025-003",
  },
  {
    id: "4",
    plotName: "Delta Wetland Reserve",
    landownerName: "Rina Marlina",
    volumeTonCO2e: 2500,
    pricePerTon: 42.0,
    totalAmount: 105000,
    status: "COMPLETED",
    transactionDate: "2025-07-20T13:30:00Z",
    certificateDate: "2025-07-25T09:00:00Z",
    certificateId: "CF-2025-004",
  },
  {
    id: "5",
    plotName: "Highland Rainforest Plot",
    landownerName: "Yohanes Kambu",
    volumeTonCO2e: 1800,
    pricePerTon: 48.0,
    totalAmount: 86400,
    status: "FAILED",
    transactionDate: "2025-06-10T11:20:00Z",
    certificateDate: "2025-06-15T15:00:00Z",
    certificateId: "CF-2025-005",
  },
  {
    id: "6",
    plotName: "Coastal Mangrove Belt",
    landownerName: "Dewi Lestari",
    volumeTonCO2e: 4200,
    pricePerTon: 35.0,
    totalAmount: 147000,
    status: "COMPLETED",
    transactionDate: "2025-05-05T08:00:00Z",
    certificateDate: "2025-05-10T10:30:00Z",
    certificateId: "CF-2025-006",
  },
  {
    id: "7",
    plotName: "Borneo Rainforest Sanctuary",
    landownerName: "PT Hutan Lestari",
    volumeTonCO2e: 8000,
    pricePerTon: 55.0,
    totalAmount: 440000,
    status: "COMPLETED",
    transactionDate: "2025-04-12T14:00:00Z",
    certificateDate: "2025-04-18T09:30:00Z",
    certificateId: "CF-2025-007",
  },
  {
    id: "8",
    plotName: "Sumatra Peatland Conservation",
    landownerName: "CV Gambut Hijau",
    volumeTonCO2e: 6000,
    pricePerTon: 40.0,
    totalAmount: 240000,
    status: "COMPLETED",
    transactionDate: "2025-03-08T11:00:00Z",
    certificateDate: "2025-03-15T10:00:00Z",
    certificateId: "CF-2025-008",
  },
  {
    id: "9",
    plotName: "Sulawesi Mangrove Restoration",
    landownerName: "Kelompok Tani Bakau",
    volumeTonCO2e: 3500,
    pricePerTon: 44.0,
    totalAmount: 154000,
    status: "PENDING",
    transactionDate: "2025-10-03T09:30:00Z",
    certificateDate: "2025-10-08T14:00:00Z",
    certificateId: "CF-2025-009",
  },
  {
    id: "10",
    plotName: "Java Reforestation Project",
    landownerName: "PT Hijau Nusantara",
    volumeTonCO2e: 10000,
    pricePerTon: 36.0,
    totalAmount: 360000,
    status: "COMPLETED",
    transactionDate: "2025-02-14T10:00:00Z",
    certificateDate: "2025-02-20T11:30:00Z",
    certificateId: "CF-2025-010",
  },
];

export default function TransactionsPage() {
  const [transactions] = useState<CorporateTransaction[]>(mockTransactions);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Transaction History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all your carbon credit purchase transactions.
        </p>
      </div>

      {/* Transaction table */}
      <TransactionTable transactions={transactions} />
    </div>
  );
}
