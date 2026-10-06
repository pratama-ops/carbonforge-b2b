"use client";

import { useState } from "react";
import CorporateStats from "@/components/dashboard/corporate/CorporateStats";
import CarbonMatchmaking from "@/components/dashboard/corporate/CarbonMatchmaking";
import TransactionTable from "@/components/dashboard/corporate/TransactionTable";
import Button from "@/components/ui/Button";
import type {
  CorporateStats as CorporateStatsType,
  MatchmakingRecommendation,
  CorporateTransaction,
} from "@/lib/types";

// ============================================================================
// Corporate Dashboard — Overview page
// ============================================================================

const mockStats: CorporateStatsType = {
  totalCarbonOffsetTon: 28450,
  annualEmissionTargetTon: 50000,
  totalCarbonInvestment: 1422500,
  completedTransactions: 12,
  pendingTransactions: 3,
};

const mockRecommendations: MatchmakingRecommendation[] = [
  {
    id: "1",
    plotName: "North Mangrove Reserve",
    location: "East Kalimantan, Indonesia",
    vegetationType: "Mangrove",
    areaHa: 320,
    estimatedCarbonCredits: 12800,
    sustainabilityRating: 5,
    pricePerCredit: 45.5,
    landownerName: "Budi Santoso",
    matchScore: 95,
  },
  {
    id: "2",
    plotName: "Peatland Restoration Area",
    location: "Central Kalimantan, Indonesia",
    vegetationType: "Peatland",
    areaHa: 450,
    estimatedCarbonCredits: 18500,
    sustainabilityRating: 4,
    pricePerCredit: 38.0,
    landownerName: "Siti Rahayu",
    matchScore: 88,
  },
  {
    id: "3",
    plotName: "Tropical Forest Corridor",
    location: "West Kalimantan, Indonesia",
    vegetationType: "Tropical Rainforest",
    areaHa: 280,
    estimatedCarbonCredits: 9200,
    sustainabilityRating: 5,
    pricePerCredit: 52.0,
    landownerName: "Ahmad Wijaya",
    matchScore: 82,
  },
  {
    id: "4",
    plotName: "Coastal Mangrove Belt",
    location: "South Sumatra, Indonesia",
    vegetationType: "Mangrove",
    areaHa: 150,
    estimatedCarbonCredits: 5600,
    sustainabilityRating: 3,
    pricePerCredit: 35.0,
    landownerName: "Dewi Lestari",
    matchScore: 75,
  },
  {
    id: "5",
    plotName: "Highland Rainforest Plot",
    location: "Papua, Indonesia",
    vegetationType: "Tropical Rainforest",
    areaHa: 200,
    estimatedCarbonCredits: 7800,
    sustainabilityRating: 4,
    pricePerCredit: 48.0,
    landownerName: "Yohanes Kambu",
    matchScore: 70,
  },
  {
    id: "6",
    plotName: "Delta Wetland Reserve",
    location: "Riau, Indonesia",
    vegetationType: "Peatland",
    areaHa: 180,
    estimatedCarbonCredits: 6400,
    sustainabilityRating: 4,
    pricePerCredit: 42.0,
    landownerName: "Rina Marlina",
    matchScore: 68,
  },
];

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
];

export default function CorporateDashboardPage() {
  const [recommendations] = useState<MatchmakingRecommendation[]>(mockRecommendations);
  const [transactions] = useState<CorporateTransaction[]>(mockTransactions);

  const handleInitiateTransaction = (id: string) => {
    console.log("Initiate transaction for recommendation:", id);
    // TODO: Implement transaction initiation flow
  };

  const handleViewDetails = (id: string) => {
    console.log("View details for recommendation:", id);
    // TODO: Navigate to detail page or open modal
  };

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
        <Button variant="primary">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Offset Purchase
        </Button>
      </div>

      {/* Stats overview */}
      <section aria-label="Overview statistics">
        <CorporateStats stats={mockStats} />
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
          <Button variant="ghost" size="sm">
            View All
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
        <CarbonMatchmaking
          recommendations={recommendations.slice(0, 3)}
          onInitiateTransaction={handleInitiateTransaction}
          onViewDetails={handleViewDetails}
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
          <Button variant="ghost" size="sm">
            View All
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
        <TransactionTable transactions={transactions.slice(0, 5)} />
      </section>
    </div>
  );
}
