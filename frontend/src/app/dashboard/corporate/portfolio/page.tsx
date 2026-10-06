"use client";

import { useState } from "react";
import type { CorporateTransaction } from "@/lib/types";
import TransactionStatusBadge from "@/components/dashboard/corporate/TransactionStatusBadge";

// ============================================================================
// Corporate Dashboard — Portfolio page
// ============================================================================

const mockPortfolio: CorporateTransaction[] = [
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
];

export default function PortfolioPage() {
  const [portfolio] = useState<CorporateTransaction[]>(mockPortfolio);

  const totalOffset = portfolio.reduce((sum, tx) => sum + tx.volumeTonCO2e, 0);
  const totalInvested = portfolio.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const uniquePlots = new Set(portfolio.map((tx) => tx.plotName)).size;

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
          Carbon Offset Portfolio
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your carbon credit holdings and offset progress.
        </p>
      </div>

      {/* Portfolio summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Carbon Offset</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {totalOffset.toLocaleString()} tCO₂e
          </p>
          <p className="mt-1 text-sm text-slate-500">Across {uniquePlots} land plots</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Total Invested</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {formatCurrency(totalInvested)}
          </p>
          <p className="mt-1 text-sm text-slate-500">Lifetime carbon investment</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Active Certificates</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {portfolio.length}
          </p>
          <p className="mt-1 text-sm text-slate-500">Verified carbon credits</p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
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
                Landowner
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
                Investment
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Certificate ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {portfolio.map((holding) => (
              <tr key={holding.id} className="transition-colors hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                      <svg
                        className="h-5 w-5 text-emerald-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{holding.plotName}</p>
                      <p className="text-xs text-slate-500">
                        Issued {formatDate(holding.certificateDate)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                  {holding.landownerName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                  {holding.volumeTonCO2e.toLocaleString()} tCO₂e
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {formatCurrency(holding.totalAmount)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {holding.certificateId}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <TransactionStatusBadge status={holding.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
