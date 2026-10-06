"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { VegetationType } from "@/lib/types";

// ============================================================================
// RegisterLandPlotModal — Form to register a new land plot
// ============================================================================

const vegetationOptions: VegetationType[] = ["Mangrove", "Tropical Rainforest", "Peatland"];

interface RegisterLandPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    location: string;
    lat: string;
    lng: string;
    areaHa: string;
    vegetationType: VegetationType;
  }) => void;
}

export default function RegisterLandPlotModal({
  isOpen,
  onClose,
  onSubmit,
}: RegisterLandPlotModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [vegetationType, setVegetationType] = useState<VegetationType>("Mangrove");
  const [documents, setDocuments] = useState<FileList | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, location, lat, lng, areaHa, vegetationType });
    // Reset form
    setName("");
    setLocation("");
    setLat("");
    setLng("");
    setAreaHa("");
    setVegetationType("Mangrove");
    setDocuments(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 id="register-modal-title" className="text-lg font-semibold text-slate-900">
            Register New Land Plot
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          <Input
            label="Land Plot Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., North Mangrove Reserve"
            required
          />

          <Input
            label="Location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., East Kalimantan, Indonesia"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              name="lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-0.5234"
              required
            />
            <Input
              label="Longitude"
              name="lng"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="117.2345"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Area (Hectares)"
              name="areaHa"
              type="number"
              step="any"
              min="0"
              value={areaHa}
              onChange={(e) => setAreaHa(e.target.value)}
              placeholder="150"
              required
            />
            <div>
              <label
                htmlFor="vegetation-type"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Vegetation Type
              </label>
              <select
                id="vegetation-type"
                name="vegetationType"
                value={vegetationType}
                onChange={(e) => setVegetationType(e.target.value as VegetationType)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                {vegetationOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File upload */}
          <div>
            <label
              htmlFor="documents"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Supporting Documents
            </label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div className="mt-2">
                  <label
                    htmlFor="documents"
                    className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Click to upload
                  </label>
                  <span className="text-sm text-slate-500"> or drag and drop</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">PDF, PNG, JPG up to 10MB</p>
                <input
                  id="documents"
                  name="documents"
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setDocuments(e.target.files)}
                  className="sr-only"
                />
              </div>
            </div>
            {documents && documents.length > 0 && (
              <ul className="mt-2 space-y-1">
                {Array.from(documents).map((file, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Register Land Plot
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
