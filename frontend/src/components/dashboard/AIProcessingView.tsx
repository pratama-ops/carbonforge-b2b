"use client";

import type { ProcessingStep } from "@/lib/types";

// ============================================================================
// AIProcessingView — Loading screen with step progress indicator
// ============================================================================

interface AIProcessingViewProps {
  steps: ProcessingStep[];
  currentStepIndex: number;
}

export default function AIProcessingView({
  steps,
  currentStepIndex,
}: AIProcessingViewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-8 w-8 animate-pulse text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          AI Sedang Memproses Dokumen
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Mohon tunggu, sistem sedang menganalisis dokumen Anda
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-md space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div
              key={step.id}
              className={[
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all",
                isActive
                  ? "bg-emerald-50 border border-emerald-200"
                  : isCompleted
                    ? "bg-slate-50"
                    : "bg-slate-50 opacity-50",
              ].join(" ")}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600">
                    <svg
                      className="h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="flex h-6 w-6 items-center justify-center">
                    <svg
                      className="h-5 w-5 animate-spin text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300" />
                )}
              </div>

              {/* Step label */}
              <span
                className={[
                  "text-sm font-medium",
                  isActive
                    ? "text-emerald-700"
                    : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-8 max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-slate-500">
          Langkah {currentStepIndex + 1} dari {steps.length}
        </p>
      </div>
    </div>
  );
}
