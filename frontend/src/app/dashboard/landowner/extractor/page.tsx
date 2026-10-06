"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import DocumentUploadZone from "@/components/dashboard/DocumentUploadZone";
import AIProcessingView from "@/components/dashboard/AIProcessingView";
import ExtractedDataForm from "@/components/dashboard/ExtractedDataForm";
import type { ExtractedLandData, ProcessingStep } from "@/lib/types";

// ============================================================================
// AI Document Extractor — Page Component
// ============================================================================

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "analyze", label: "Menganalisis dokumen...", status: "pending" },
  { id: "extract", label: "Mengekstrak koordinat GPS & luas lahan...", status: "pending" },
  { id: "validate", label: "Memvalidasi nomor sertifikat...", status: "pending" },
  { id: "carbon", label: "Menghitung estimasi potensi karbon...", status: "pending" },
];

const MOCK_EXTRACTED_DATA: ExtractedLandData = {
  certificateNumber: "SHM No. 1234/Desa Sukamaju/2024",
  ownerName: "Budi Santoso",
  gpsCoordinates: {
    lat: "-0.5234",
    lng: "117.2345",
  },
  areaHectares: "150",
  estimatedCarbonPotential: "2500",
};

export default function DocumentExtractorPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "ready" | "processing" | "completed">("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractedLandData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setStatus("ready");
  }, []);

  const handleStartExtraction = useCallback(() => {
    if (!selectedFile) return;

    setStatus("processing");
    setCurrentStepIndex(0);

    // Simulate AI processing with step progression
    let step = 0;
    processingIntervalRef.current = setInterval(() => {
      step++;
      if (step < PROCESSING_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        if (processingIntervalRef.current) {
          clearInterval(processingIntervalRef.current);
        }
        setExtractedData(MOCK_EXTRACTED_DATA);
        setStatus("completed");
      }
    }, 2000);
  }, [selectedFile]);

  const handleSaveAndContinue = useCallback(async (data: ExtractedLandData) => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In real implementation, this would navigate to land registration
    // router.push("/dashboard/landowner/lands/new");
    alert("Data tersimpan! Mengalihkan ke pendaftaran lahan...");
    setIsSaving(false);
  }, [router]);

  const handleReset = useCallback(() => {
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
    }
    setStatus("idle");
    setSelectedFile(null);
    setExtractedData(null);
    setCurrentStepIndex(0);
  }, []);

  const stepsWithStatus = PROCESSING_STEPS.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? ("completed" as const)
        : index === currentStepIndex
          ? ("active" as const)
          : ("pending" as const),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          AI Document Extractor
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Unggah sertifikat atau dokumen legalitas lahan untuk mengisi data
          formulir pendaftaran secara otomatis
        </p>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {status === "idle" && (
          <div className="space-y-6">
            <DocumentUploadZone onFileSelect={handleFileSelect} />

            {selectedFile && (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setStatus("idle");
                  }}
                >
                  Hapus
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleStartExtraction}
                disabled={!selectedFile}
                size="lg"
              >
                <svg
                  className="h-5 w-5"
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
                Extract Data
              </Button>
            </div>
          </div>
        )}

        {status === "ready" && selectedFile && (
          <div className="space-y-6">
            <DocumentUploadZone onFileSelect={handleFileSelect} />

            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  setStatus("idle");
                }}
              >
                Hapus
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleStartExtraction}
                disabled={!selectedFile}
                size="lg"
              >
                <svg
                  className="h-5 w-5"
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
                Extract Data
              </Button>
            </div>
          </div>
        )}

        {status === "processing" && (
          <AIProcessingView
            steps={stepsWithStatus}
            currentStepIndex={currentStepIndex}
          />
        )}

        {status === "completed" && extractedData && (
          <ExtractedDataForm
            data={extractedData}
            onSave={handleSaveAndContinue}
            onReset={handleReset}
            isSaving={isSaving}
          />
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Cara Menggunakan AI Document Extractor
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              1
            </div>
            <h3 className="text-sm font-medium text-slate-900">Unggah Dokumen</h3>
            <p className="mt-1 text-xs text-slate-500">
              Upload sertifikat atau dokumen legalitas lahan dalam format PDF, PNG, atau JPG
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              2
            </div>
            <h3 className="text-sm font-medium text-slate-900">AI Mengekstrak Data</h3>
            <p className="mt-1 text-xs text-slate-500">
              Sistem AI akan menganalisis dan mengekstrak data penting dari dokumen
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              3
            </div>
            <h3 className="text-sm font-medium text-slate-900">Review & Simpan</h3>
            <p className="mt-1 text-xs text-slate-500">
              Periksa hasil ekstraksi, edit jika diperlukan, lalu simpan untuk pendaftaran
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
