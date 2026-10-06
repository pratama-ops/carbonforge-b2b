"use client";

import { useState } from "react";
import LandownerStats from "@/components/dashboard/LandownerStats";
import LandPlotList from "@/components/dashboard/LandPlotList";
import RegisterLandPlotModal from "@/components/dashboard/RegisterLandPlotModal";
import Button from "@/components/ui/Button";
import type { LandPlot, LandownerStats as LandownerStatsType, VegetationType } from "@/lib/types";

// ============================================================================
// Landowner Dashboard — Main page
// ============================================================================

const mockStats: LandownerStatsType = {
  totalLandAreaHa: 1250,
  totalEstimatedCarbonCredits: 45200,
  verifiedCount: 3,
  pendingCount: 2,
  rejectedCount: 1,
  totalPlots: 6,
};

const mockPlots: LandPlot[] = [
  {
    id: "1",
    name: "North Mangrove Reserve",
    location: "East Kalimantan, Indonesia",
    coordinates: { lat: -0.5234, lng: 117.2345 },
    areaHa: 320,
    vegetationType: "Mangrove",
    status: "VERIFIED",
    estimatedCarbonCredits: 12800,
    registeredAt: "2025-08-15T08:00:00Z",
    documentsCount: 4,
  },
  {
    id: "2",
    name: "Peatland Restoration Area",
    location: "Central Kalimantan, Indonesia",
    coordinates: { lat: -1.2345, lng: 114.5678 },
    areaHa: 450,
    vegetationType: "Peatland",
    status: "PENDING",
    estimatedCarbonCredits: 18500,
    registeredAt: "2025-09-20T10:30:00Z",
    documentsCount: 3,
  },
  {
    id: "3",
    name: "Tropical Forest Corridor",
    location: "West Kalimantan, Indonesia",
    coordinates: { lat: 0.3456, lng: 110.1234 },
    areaHa: 280,
    vegetationType: "Tropical Rainforest",
    status: "VERIFIED",
    estimatedCarbonCredits: 9200,
    registeredAt: "2025-07-10T14:00:00Z",
    documentsCount: 5,
  },
  {
    id: "4",
    name: "Coastal Mangrove Belt",
    location: "South Sumatra, Indonesia",
    coordinates: { lat: -3.4567, lng: 105.6789 },
    areaHa: 150,
    vegetationType: "Mangrove",
    status: "REJECTED",
    estimatedCarbonCredits: 5600,
    registeredAt: "2025-10-01T09:15:00Z",
    documentsCount: 2,
  },
  {
    id: "5",
    name: "Highland Rainforest Plot",
    location: "Papua, Indonesia",
    coordinates: { lat: -2.5678, lng: 140.2345 },
    areaHa: 200,
    vegetationType: "Tropical Rainforest",
    status: "PENDING",
    estimatedCarbonCredits: 7800,
    registeredAt: "2025-10-05T11:45:00Z",
    documentsCount: 3,
  },
  {
    id: "6",
    name: "Delta Wetland Reserve",
    location: "Riau, Indonesia",
    coordinates: { lat: 0.1234, lng: 101.4567 },
    areaHa: 180,
    vegetationType: "Peatland",
    status: "VERIFIED",
    estimatedCarbonCredits: 6400,
    registeredAt: "2025-06-20T16:30:00Z",
    documentsCount: 4,
  },
];

export default function LandownerDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plots, setPlots] = useState<LandPlot[]>(mockPlots);

  const handleRegisterPlot = (data: {
    name: string;
    location: string;
    lat: string;
    lng: string;
    areaHa: string;
    vegetationType: VegetationType;
  }) => {
    const newPlot: LandPlot = {
      id: String(plots.length + 1),
      name: data.name,
      location: data.location,
      coordinates: { lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
      areaHa: parseFloat(data.areaHa),
      vegetationType: data.vegetationType,
      status: "PENDING",
      estimatedCarbonCredits: Math.round(parseFloat(data.areaHa) * 35), // Rough estimate
      registeredAt: new Date().toISOString(),
      documentsCount: 0,
    };
    setPlots([newPlot, ...plots]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Landowner Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your carbon land plots and track verification status.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Register New Plot
        </Button>
      </div>

      {/* Stats overview */}
      <section aria-label="Overview statistics">
        <LandownerStats stats={mockStats} />
      </section>

      {/* Land plots list */}
      <section aria-label="My land plots">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">My Land Plots</h2>
          <span className="text-sm text-slate-500">{plots.length} plots registered</span>
        </div>
        <LandPlotList plots={plots} />
      </section>

      {/* Registration modal */}
      <RegisterLandPlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterPlot}
      />
    </div>
  );
}
