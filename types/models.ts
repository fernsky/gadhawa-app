// Base types for common fields
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: "pending" | "syncing" | "synced" | "error";
  version: number;
}

// Asset types
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: Date;
}

export interface ImageAsset {
  id: string;
  uri: string;
  type: "building" | "person" | "document";
  metadata?: {
    width: number;
    height: number;
    size: number;
  };
  syncStatus: "pending" | "synced";
}

export interface AudioAsset {
  id: string;
  uri: string;
  duration: number;
  transcript?: string;
  syncStatus: "pending" | "synced";
}

// Main data models
export interface Building extends BaseModel {
  name?: string;
  address: {
    ward: number;
    tole: string;
    streetName?: string;
    houseNumber?: string;
    landmark?: string;
  };
  location: GeoLocation;
  buildingType: "residential" | "commercial" | "mixed" | "institutional";
  constructionType: "rcc" | "load-bearing" | "wooden" | "other";
  totalFloors: number;
  constructionYear?: number;
  landArea?: number;
  builtArea?: number;
  images: ImageAsset[];
  familyIds: string[];
  businessIds: string[];
  metadata?: Record<string, any>;
}

export interface Family extends BaseModel {
  buildingId: string;
  headId: string; // Reference to Individual
  name: string;
  memberIds: string[]; // References to Individual
  economicStatus: "low" | "middle" | "high";
  monthlyIncome?: number;
  residencyType: "owned" | "rented" | "other";
  residencySince?: Date;
  images?: ImageAsset[];
  audio?: AudioAsset[];
  metadata?: Record<string, any>;
}

export interface Individual extends BaseModel {
  familyId: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  maritalStatus: "single" | "married" | "widowed" | "divorced";
  education?: {
    level: "none" | "primary" | "secondary" | "bachelor" | "master" | "phd";
    status: "completed" | "ongoing" | "dropped";
    institution?: string;
  };
  occupation?: {
    type: string;
    organization?: string;
    position?: string;
    monthlyIncome?: number;
  };
  contact?: {
    phone?: string;
    email?: string;
    emergencyContact?: string;
  };
  healthInfo?: {
    disability?: boolean;
    chronicIllness?: boolean;
    description?: string;
  };
  images?: ImageAsset[];
  documents?: ImageAsset[];
  metadata?: Record<string, any>;
}

export interface Business extends BaseModel {
  buildingId: string;
  name: string;
  type: string;
  registrationNo?: string;
  ownership: "sole" | "partnership" | "corporation" | "other";
  establishedDate: Date;
  ownerId: string; // Reference to Individual
  employees: {
    permanent: number;
    temporary: number;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  premises: {
    floorNumber: number;
    area: number;
    rent?: number;
  };
  turnover?: {
    yearly: number;
    currency: string;
  };
  images?: ImageAsset[];
  licenses?: ImageAsset[];
  metadata?: Record<string, any>;
}

// Survey specific types
export interface SurveyResponse extends BaseModel {
  surveyId: string;
  entityType: "building" | "family" | "individual" | "business";
  entityId: string;
  responses: Array<{
    questionId: string;
    value: any;
    skipReason?: string;
  }>;
  location?: GeoLocation;
  images?: ImageAsset[];
  audio?: AudioAsset[];
  completedBy: string; // Reference to surveyor
  verifiedBy?: string; // Reference to verifier
  status: "draft" | "completed" | "verified" | "rejected";
  metadata?: Record<string, any>;
}

// Enums for common fields
export enum SyncStatus {
  Pending = "pending",
  Syncing = "syncing",
  Synced = "synced",
  Error = "error",
}

export enum BuildingType {
  Residential = "residential",
  Commercial = "commercial",
  Mixed = "mixed",
  Institutional = "institutional",
}

export enum ConstructionType {
  RCC = "rcc",
  LoadBearing = "load-bearing",
  Wooden = "wooden",
  Other = "other",
}

export enum ResidencyType {
  Owned = "owned",
  Rented = "rented",
  Other = "other",
}

export enum EducationLevel {
  None = "none",
  Primary = "primary",
  Secondary = "secondary",
  Bachelor = "bachelor",
  Master = "master",
  PhD = "phd",
}

export enum BusinessOwnership {
  Sole = "sole",
  Partnership = "partnership",
  Corporation = "corporation",
  Other = "other",
}
