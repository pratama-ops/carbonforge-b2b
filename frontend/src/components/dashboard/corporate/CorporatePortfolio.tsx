"use client";

import { useState, useMemo } from "react";
import type { CorporateTransaction } from "@/lib/types";
import TransactionStatusBadge from "./TransactionStatusBadge";
import Button from "@/components/ui/Button";

// ============================================================================
// CorporatePortfolio — Carbon credit portfolio overview with charts & certificates
// ============================================================================

interface CorporatePortfolioProps {
  portfolio: CorporateTransaction[];
  annualTargetTon: number;
}

type TimeRange = "6M" | "1Y" | "ALL";

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "6M", label: "Last 6 Months" },
  { value: "1Y", label: "Last Year" },
  { value: "ALL", label: "All Time" },
];

function PortfolioChart({
  data,
  annualTargetTon,
}: {
  data: { month: string; offset: number }[];
  annualTargetTon: number;
}) {
  const maxOffset = Math.max(...data.map((d) => d.offset), annualTargetTon);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Offset Progress</h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Monthly carbon offset accumulation
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600">Offset</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-slate-200" />
            <span className="text-slate-600">Target</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2" style={{ height: "200px" }}>
        {data.map((item, index) => {
          const heightPercent = (item.offset / maxOffset) * 100;
          const targetHeight = (annualTargetTon / maxOffset) * 100;
          const isLast = index === data.length - 1;

          return (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end justify-center">
                {/* Target line */}
                <div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-slate-300"
                  style={{ bottom: `${targetHeight}%` }}
                />
                {/* Bar */}
                <div
                  className={`w-full max-w-[40px] rounded-t-md transition-all ${
                    isLast ? "bg-emerald-500" : "bg-emerald-200"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.month}: ${item.offset.toLocaleString()} tCO₂e`}
                />
              </div>
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CertificateCard({ transaction }: { transaction: CorporateTransaction }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
          <svg
            className="h-6 w-6 text-emerald-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">{transaction.certificateId}</p>
          <p className="text-sm text-slate-500">{transaction.plotName}</p>
          <p className="text-xs text-slate-400">Issued {formatDate(transaction.certificateDate)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">
          {transaction.volumeTonCO2e.toLocaleString()} tCO₂e
        </p>
        <TransactionStatusBadge status={transaction.status} />
      </div>
    </div>
  );
}

export default function CorporatePortfolio({
  portfolio,
  annualTargetTon,
}: CorporatePortfolioProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("ALL");

  const filteredPortfolio = useMemo(() => {
    if (timeRange === "ALL") return portfolio;

    const now = new Date();
    const monthsBack = timeRange === "6M" ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);

    return portfolio.filter((tx) => new Date(tx.transactionDate) >= cutoff);
  }, [portfolio, timeRange]);

  const totalOffset = filteredPortfolio.reduce((sum, tx) => sum + tx.volumeTonCO2e, 0);
  const totalInvested = filteredPortfolio.reduce((sum, tx) => sum + tx.totalAmount, 0);
  const uniquePlots = new Set(filteredPortfolio.map((tx) => tx.plotName)).size;
  const activeCertificates = filteredPortfolio.filter((tx) => tx.status === "COMPLETED").length;

  const offsetProgress = Math.round((totalOffset / annualTargetTon) * 100);

  // Generate chart data
  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    filteredPortfolio.forEach((tx) => {
      const date = new Date(tx.transactionDate);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + tx.volumeTonCO2e;
    });

    return Object.entries(monthlyData).map(([month, offset]) => ({
      month,
      offset,
    }));
  }, [filteredPortfolio]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            {activeCertificates}
          </p>
          <p className="mt-1 text-sm text-slate-500">Verified carbon credits</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-medium text-slate-500">Target Progress</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-700">
            {offsetProgress}%
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(offsetProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <PortfolioChart data={chartData} annualTargetTon={annualTargetTon} />

      {/* Holdings Table */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Holdings</h3>
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
              {filteredPortfolio.map((holding) => (
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
                          {new Date(holding.certificateDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
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

      {/* Active Certificates */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Active Certificates</h3>
          <Button variant="ghost" size="sm">
            Download All
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredPortfolio
            .filter((tx) => tx.status === "COMPLETED")
            .map((tx) => (
              <CertificateCard key={tx.id} transaction={tx} />
            ))}
        </div>
      </div>
    </div>
  );
}
