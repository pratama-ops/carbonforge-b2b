"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { ExtractedLandData } from "@/lib/types";

// ============================================================================
// ExtractedDataForm — Preview and edit extracted land data
// ============================================================================

interface ExtractedDataFormProps {
  data: ExtractedLandData;
  onSave: (data: ExtractedLandData) => void;
  onReset: () => void;
  isSaving?: boolean;
}

export default function ExtractedDataForm({
  data,
  onSave,
  onReset,
  isSaving = false,
}: ExtractedDataFormProps) {
  const [formData, setFormData] = useState<ExtractedLandData>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof ExtractedLandData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExtractedLandData, string>> = {};

    if (!formData.certificateNumber.trim()) {
      newErrors.certificateNumber = "Nomor sertifikat wajib diisi";
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Nama pemilik wajib diisi";
    }
    if (!formData.gpsCoordinates.lat.trim()) {
      newErrors.gpsCoordinates = "Latitude wajib diisi";
    }
    if (!formData.gpsCoordinates.lng.trim()) {
      newErrors.gpsCoordinates = "Longitude wajib diisi";
    }
    if (!formData.areaHectares.trim()) {
      newErrors.areaHectares = "Luas lahan wajib diisi";
    }
    if (!formData.estimatedCarbonPotential.trim()) {
      newErrors.estimatedCarbonPotential = "Estimasi potensi karbon wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const updateField = (field: keyof ExtractedLandData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const updateCoordinate = (field: "lat" | "lng", value: string) => {
    setFormData((prev) => ({
      ...prev,
      gpsCoordinates: { ...prev.gpsCoordinates, [field]: value },
    }));
    if (errors.gpsCoordinates) {
      setErrors((prev) => ({ ...prev, gpsCoordinates: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success message */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Ekstraksi Data Berhasil
            </p>
            <p className="mt-0.5 text-sm text-emerald-700">
              Data berikut telah diekstrak dari dokumen. Silakan periksa dan edit
              jika diperlukan sebelum melanjutkan.
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        <Input
          label="Nomor Sertifikat / Hak Milik"
          name="certificateNumber"
          value={formData.certificateNumber}
          onChange={(e) => updateField("certificateNumber", e.target.value)}
          placeholder="e.g., SHM No. 1234/2024"
          error={errors.certificateNumber}
          required
        />

        <Input
          label="Nama Pemilik / Landowner"
          name="ownerName"
          value={formData.ownerName}
          onChange={(e) => updateField("ownerName", e.target.value)}
          placeholder="e.g., Budi Santoso"
          error={errors.ownerName}
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Koordinat GPS / Batas Wilayah
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.gpsCoordinates.lat}
                onChange={(e) => updateCoordinate("lat", e.target.value)}
                placeholder="Latitude: -0.5234"
                className={[
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
                  errors.gpsCoordinates
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100",
                ].join(" ")}
                aria-label="Latitude"
                aria-invalid={errors.gpsCoordinates ? "true" : "false"}
              />
            </div>
            <div>
              <input
                type="text"
                value={formData.gpsCoordinates.lng}
                onChange={(e) => updateCoordinate("lng", e.target.value)}
                placeholder="Longitude: 117.2345"
                className={[
                  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
                  errors.gpsCoordinates
                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:border-emerald-600 focus:ring-emerald-100",
                ].join(" ")}
                aria-label="Longitude"
                aria-invalid={errors.gpsCoordinates ? "true" : "false"}
              />
            </div>
          </div>
          {errors.gpsCoordinates && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.gpsCoordinates}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Luas Lahan (Hektar)"
            name="areaHectares"
            type="number"
            step="any"
            min="0"
            value={formData.areaHectares}
            onChange={(e) => updateField("areaHectares", e.target.value)}
            placeholder="150"
            error={errors.areaHectares}
            required
          />

          <Input
            label="Estimasi Potensi Karbon (Ton CO2e)"
            name="estimatedCarbonPotential"
            type="number"
            step="any"
            min="0"
            value={formData.estimatedCarbonPotential}
            onChange={(e) => updateField("estimatedCarbonPotential", e.target.value)}
            placeholder="2500"
            error={errors.estimatedCarbonPotential}
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          disabled={isSaving}
          className="order-2 sm:order-1"
        >
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
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Unggah Ulang Dokumen
        </Button>

        <Button
          type="submit"
          loading={isSaving}
          className="order-1 sm:order-2"
        >
          Simpan & Lanjutkan ke Pendaftaran Lahan
        </Button>
      </div>
    </form>
  );
}
