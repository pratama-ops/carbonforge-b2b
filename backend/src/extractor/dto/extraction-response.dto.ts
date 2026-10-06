export class ExtractionResponseDto {
  documentId: string;
  status: string;
  extractedData: {
    certificateNumber: string;
    ownerName: string;
    gpsCoordinates: {
      lat: string;
      lng: string;
    };
    areaHectares: string;
    estimatedCarbonPotential: string;
    confidence?: number;
    vegetationType?: string;
    additionalNotes?: string;
  };
  aiConfidence: number;
  processingTimeMs: number;
}
