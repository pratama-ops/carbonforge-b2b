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

// ============================================================================
// CarbonForge B2B — Corporate / Buyer Dashboard Types
// ============================================================================

export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface CorporateStats {
  totalCarbonOffsetTon: number;
  annualEmissionTargetTon: number;
  totalCarbonInvestment: number;
  completedTransactions: number;
  pendingTransactions: number;
}

export interface MatchmakingRecommendation {
  id: string;
  plotName: string;
  location: string;
  vegetationType: VegetationType;
  areaHa: number;
  estimatedCarbonCredits: number;
  sustainabilityRating: number; // 1-5
  pricePerCredit: number;
  landownerName: string;
  matchScore: number; // percentage 0-100
}

export interface CorporateTransaction {
  id: string;
  plotName: string;
  landownerName: string;
  volumeTonCO2e: number;
  pricePerTon: number;
  totalAmount: number;
  status: TransactionStatus;
  transactionDate: string;
  certificateDate: string;
  certificateId: string;
}

export interface CorporateProfile {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  billingEmail: string;
  taxId: string;
  annualTargetTon: number;
}

// ============================================================================
// CarbonForge B2B — Landowner Sub-Page Types
// ============================================================================

export type LandownerTransactionStatus = "COMPLETED" | "PROCESSING";

export interface LandownerTransaction {
  id: string;
  buyerName: string;
  plotName: string;
  volumeTonCO2e: number;
  pricePerTon: number;
  totalAmount: number;
  status: LandownerTransactionStatus;
  transactionDate: string;
}

export interface LandownerProfile {
  name: string;
  email: string;
  phone: string;
  walletAddress: string;
}

// ============================================================================
// CarbonForge B2B — Admin Dashboard Types
// ============================================================================

export type AdminUserRole = "LANDOWNER" | "CORPORATE_BUYER" | "ADMIN";

export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  registeredAt: string;
  lastActiveAt: string;
  totalTransactions: number;
  totalVolumeTonCO2e: number;
}

export interface AdminPlatformStats {
  totalLandRegistered: number;
  totalVolumeCarbonTonCO2e: number;
  totalActiveUsers: number;
  totalSuccessfulTransactions: number;
  pendingVerifications: number;
  totalRevenue: number;
}

export interface AdminLandVerification {
  id: string;
  plotName: string;
  landownerName: string;
  landownerEmail: string;
  location: string;
  areaHa: number;
  vegetationType: VegetationType;
  estimatedCarbonCredits: number;
  submittedAt: string;
  documentsCount: number;
  status: VerificationStatus;
  documents: AdminDocument[];
}

export interface AdminDocument {
  id: string;
  name: string;
  type: "LAND_TITLE" | "VEGETATION_REPORT" | "GPS_COORDINATES" | "IDENTITY" | "OTHER";
  uploadedAt: string;
  fileSize: string;
  verified: boolean;
}

export interface AdminTransaction {
  id: string;
  plotName: string;
  landownerName: string;
  buyerName: string;
  volumeTonCO2e: number;
  pricePerTon: number;
  totalAmount: number;
  status: TransactionStatus;
  transactionDate: string;
  certificateId: string | null;
}

export interface AdminSystemLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  category: "AUTH" | "VERIFICATION" | "TRANSACTION" | "USER_MANAGEMENT" | "SYSTEM";
  message: string;
  userId: string | null;
  userName: string | null;
  metadata: Record<string, string | number | boolean> | null;
}

export interface AdminSettings {
  platformName: string;
  supportEmail: string;
  maxLandAreaHa: number;
  verificationRequired: boolean;
  autoApproveThreshold: number;
  maintenanceMode: boolean;
  notificationEmail: boolean;
  notificationSms: boolean;
  platformFeePercent: number;
  fixedTransactionFee: number;
  minimumTransactionAmount: number;
  maximumTransactionAmount: number;
  aiConfidenceThreshold: number;
  documentToleranceDays: number;
  maxDocumentsPerLand: number;
  aiAutoExtraction: boolean;
  groqApiKey: string;
  webhookUrl: string;
  blockchainRegistryAddress: string;
  apiRateLimit: number;
  webhookRetryAttempts: number;
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  ipWhitelistEnabled: boolean;
  whitelistedIps: string[];
}
