"use client";

import { useState, useMemo } from "react";
import type { MatchmakingRecommendation, VegetationType } from "@/lib/types";
import Button from "@/components/ui/Button";

// ============================================================================
// CarbonMatchmaking — Land plot recommendations with filters
// ============================================================================

interface CarbonMatchmakingProps {
  recommendations: MatchmakingRecommendation[];
  onInitiateTransaction?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

type VegetationFilter = VegetationType | "All";
type RatingFilter = "All" | "4+" | "3+" | "2+";

const vegetationOptions: VegetationFilter[] = [
  "All",
  "Mangrove",
  "Tropical Rainforest",
  "Peatland",
];

const ratingOptions: { value: RatingFilter; label: string }[] = [
  { value: "All", label: "All Ratings" },
  { value: "4+", label: "4+ Stars" },
  { value: "3+", label: "3+ Stars" },
  { value: "2+", label: "2+ Stars" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function MatchmakingCard({
  recommendation,
  onInitiateTransaction,
  onViewDetails,
}: {
  recommendation: MatchmakingRecommendation;
  onInitiateTransaction?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{recommendation.plotName}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{recommendation.location}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {recommendation.matchScore}% match
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Vegetation</span>
          <span className="font-medium text-slate-900">{recommendation.vegetationType}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Area</span>
          <span className="font-medium text-slate-900">{recommendation.areaHa.toLocaleString()} Ha</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Est. Credits</span>
          <span className="font-medium text-slate-900">
            {recommendation.estimatedCarbonCredits.toLocaleString()} tCO₂e
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Price per Credit</span>
          <span className="font-medium text-slate-900">
            ${recommendation.pricePerCredit.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Landowner</span>
          <span className="font-medium text-slate-900">{recommendation.landownerName}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-2">
        <StarRating rating={recommendation.sustainabilityRating} />
        <span className="text-sm text-slate-500">
          {recommendation.sustainabilityRating}/5 sustainability
        </span>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onInitiateTransaction?.(recommendation.id)}
        >
          Initiate Transaction
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(recommendation.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default function CarbonMatchmaking({
  recommendations,
  onInitiateTransaction,
  onViewDetails,
}: CarbonMatchmakingProps) {
  const [vegetationFilter, setVegetationFilter] = useState<VegetationFilter>("All");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      // Vegetation filter
      if (vegetationFilter !== "All" && rec.vegetationType !== vegetationFilter) {
        return false;
      }

      // Rating filter
      if (ratingFilter !== "All") {
        const minRating = parseInt(ratingFilter.replace("+", ""), 10);
        if (rec.sustainabilityRating < minRating) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          rec.plotName.toLowerCase().includes(query) ||
          rec.location.toLowerCase().includes(query) ||
          rec.landownerName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [recommendations, vegetationFilter, ratingFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
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
              placeholder="Search by name, location, or landowner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Vegetation filter */}
          <select
            value={vegetationFilter}
            onChange={(e) => setVegetationFilter(e.target.value as VegetationFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label="Filter by vegetation type"
          >
            {vegetationOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "All Vegetation" : option}
              </option>
            ))}
          </select>

          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as RatingFilter)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            aria-label="Filter by sustainability rating"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing {filteredRecommendations.length} of {recommendations.length} recommendations
      </p>

      {/* Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecommendations.map((rec) => (
            <MatchmakingCard
              key={rec.id}
              recommendation={rec}
              onInitiateTransaction={onInitiateTransaction}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-12">
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-slate-900">No recommendations found</p>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
