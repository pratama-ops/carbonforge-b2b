// ============================================================================
// CarbonForge B2B — Auth Types
// ============================================================================

export type UserRole = "LANDOWNER" | "EXPORTER" | "BUYER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// CarbonForge B2B — Landowner Dashboard Types
// ============================================================================

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type VegetationType = "Mangrove" | "Tropical Rainforest" | "Peatland";

export interface LandPlot {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  areaHa: number;
  vegetationType: VegetationType;
  status: VerificationStatus;
  estimatedCarbonCredits: number;
  registeredAt: string;
  documentsCount: number;
}

export interface LandownerStats {
  totalLandAreaHa: number;
  totalEstimatedCarbonCredits: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalPlots: number;
}

export interface Transaction {
  id: string;
  plotName: string;
  credits: number;
  pricePerCredit: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  date: string;
}
