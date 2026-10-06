"use client";

import Link from "next/link";
import CorporateStats from "./CorporateStats";
import CarbonMatchmaking from "./CarbonMatchmaking";
import TransactionTable from "./TransactionTable";
import Button from "@/components/ui/Button";
import type {
  CorporateStats as CorporateStatsType,
  MatchmakingRecommendation,
  CorporateTransaction,
} from "@/lib/types";

// ============================================================================
// CorporateOverview — Main dashboard overview page
// ============================================================================

interface CorporateOverviewProps {
  stats: CorporateStatsType;
  recommendations: MatchmakingRecommendation[];
  transactions: CorporateTransaction[];
  onInitiateTransaction?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function CorporateOverview({
  stats,
  recommendations,
  transactions,
  onInitiateTransaction,
  onViewDetails,
}: CorporateOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Corporate Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor your carbon offset portfolio and discover new opportunities.
          </p>
        </div>
        <Link href="/dashboard/corporate/matchmaking">
          <Button variant="primary">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Offset Purchase
          </Button>
        </Link>
      </div>

      {/* Stats overview */}
      <section aria-label="Overview statistics">
        <CorporateStats stats={stats} />
      </section>

      {/* Matchmaking recommendations */}
      <section aria-label="Matchmaking recommendations">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recommended for You</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Land plots matched to your net-zero targets
            </p>
          </div>
          <Link href="/dashboard/corporate/matchmaking">
            <Button variant="ghost" size="sm">
              View All
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
        <CarbonMatchmaking
          recommendations={recommendations.slice(0, 3)}
          onInitiateTransaction={onInitiateTransaction}
          onViewDetails={onViewDetails}
        />
      </section>

      {/* Recent transactions */}
      <section aria-label="Recent transactions">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Your latest carbon credit purchases
            </p>
          </div>
          <Link href="/dashboard/corporate/transactions">
            <Button variant="ghost" size="sm">
              View All
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </Link>
        </div>
        <TransactionTable transactions={transactions.slice(0, 5)} />
      </section>
    </div>
  );
}
