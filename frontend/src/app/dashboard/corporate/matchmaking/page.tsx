"use client";

import { useState } from "react";
import CarbonMatchmaking from "@/components/dashboard/corporate/CarbonMatchmaking";
import type { MatchmakingRecommendation } from "@/lib/types";

// ============================================================================
// Corporate Dashboard — Matchmaking page
// ============================================================================

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
  {
    id: "7",
    plotName: "Borneo Rainforest Sanctuary",
    location: "North Kalimantan, Indonesia",
    vegetationType: "Tropical Rainforest",
    areaHa: 520,
    estimatedCarbonCredits: 22000,
    sustainabilityRating: 5,
    pricePerCredit: 55.0,
    landownerName: "PT Hutan Lestari",
    matchScore: 92,
  },
  {
    id: "8",
    plotName: "Sumatra Peatland Conservation",
    location: "Jambi, Indonesia",
    vegetationType: "Peatland",
    areaHa: 380,
    estimatedCarbonCredits: 15200,
    sustainabilityRating: 4,
    pricePerCredit: 40.0,
    landownerName: "CV Gambut Hijau",
    matchScore: 85,
  },
  {
    id: "9",
    plotName: "Sulawesi Mangrove Restoration",
    location: "South Sulawesi, Indonesia",
    vegetationType: "Mangrove",
    areaHa: 210,
    estimatedCarbonCredits: 8400,
    sustainabilityRating: 4,
    pricePerCredit: 44.0,
    landownerName: "Kelompok Tani Bakau",
    matchScore: 78,
  },
];

export default function MatchmakingPage() {
  const [recommendations] = useState<MatchmakingRecommendation[]>(mockRecommendations);

  const handleInitiateTransaction = (id: string) => {
    console.log("Initiate transaction for recommendation:", id);
    // TODO: Implement transaction initiation flow
  };

  const handleViewDetails = (id: string) => {
    console.log("View details for recommendation:", id);
    // TODO: Navigate to detail page or open modal
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Carbon Matchmaking
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover land plots that match your net-zero emission targets and sustainability goals.
        </p>
      </div>

      {/* Matchmaking grid with filters */}
      <CarbonMatchmaking
        recommendations={recommendations}
        onInitiateTransaction={handleInitiateTransaction}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
