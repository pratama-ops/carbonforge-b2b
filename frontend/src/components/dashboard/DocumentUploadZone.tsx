"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";

// ============================================================================
// DocumentUploadZone — Drag & drop file upload area
// ============================================================================

interface DocumentUploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = [".pdf", ".png", ".jpg", ".jpeg"];

export default function DocumentUploadZone({
  onFileSelect,
  disabled = false,
}: DocumentUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(fileExtension)) {
      setError("Format file tidak didukung. Gunakan PDF, PNG, atau JPG.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all",
          isDragOver
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
        onClick={handleBrowseClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleBrowseClick();
          }
        }}
        aria-label="Area upload dokumen"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="sr-only"
          disabled={disabled}
          aria-hidden="true"
        />

        {/* Upload Icon */}
        <div
          className={[
            "mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-colors",
            isDragOver ? "bg-emerald-100" : "bg-slate-100",
          ].join(" ")}
        >
          <svg
            className={`h-8 w-8 ${isDragOver ? "text-emerald-600" : "text-slate-400"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-slate-700">
            {isDragOver ? "Lepaskan file di sini" : "Drag & drop file atau"}
          </p>
          <p className="text-sm text-slate-500">
            <span className="font-medium text-emerald-700 hover:text-emerald-800">
              Browse File
            </span>{" "}
            dari direktori lokal
          </p>
        </div>

        {/* File info */}
        <p className="mt-3 text-xs text-slate-400">
          PDF, PNG, JPG • Maksimal {MAX_FILE_SIZE_MB}MB
        </p>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
