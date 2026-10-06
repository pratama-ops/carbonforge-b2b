import type { LandPlot } from "@/lib/types";
import StatusBadge from "./StatusBadge";

// ============================================================================
// LandPlotList — Grid of land plot cards
// ============================================================================

interface LandPlotListProps {
  plots: LandPlot[];
}

export default function LandPlotList({ plots }: LandPlotListProps) {
  if (plots.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <svg className="mx-auto h-12 w-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <h3 className="mt-4 text-sm font-medium text-slate-900">No land plots yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Register your first land plot to get started with carbon credit verification.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {plots.map((plot) => (
        <div
          key={plot.id}
          className="group rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">{plot.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="truncate">{plot.location}</span>
              </p>
            </div>
            <StatusBadge status={plot.status} />
          </div>

          {/* Details */}
          <dl className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500">Area</dt>
              <dd className="font-medium text-slate-900">{plot.areaHa.toLocaleString()} Ha</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500">Vegetation</dt>
              <dd className="font-medium text-slate-900">{plot.vegetationType}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500">Est. Credits</dt>
              <dd className="font-medium text-emerald-700">
                {plot.estimatedCarbonCredits.toLocaleString()} tCO₂e
              </dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500">Coordinates</dt>
              <dd className="font-mono text-xs text-slate-600">
                {plot.coordinates.lat.toFixed(4)}, {plot.coordinates.lng.toFixed(4)}
              </dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-slate-500">Documents</dt>
              <dd className="font-medium text-slate-900">{plot.documentsCount} files</dd>
            </div>
          </dl>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-xs text-slate-400">
              Registered {new Date(plot.registeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
