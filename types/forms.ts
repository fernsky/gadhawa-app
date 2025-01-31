import { z } from "zod";
import { GeoLocation, ImageAsset, AudioAsset } from "./models";

// Basic field types
export type FieldType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "date"
  | "time"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "textarea"
  | "geo"
  | "image"
  | "audio"
  | "file"
  | "relationship";

// Validation rules
export interface ValidationRule {
  type:
    | "required"
    | "min"
    | "max"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "email"
    | "url"
    | "phone"
    | "custom";
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
}

// Field dependencies
export interface FieldDependency {
  field: string;
  operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: any;
}

// Option type for select fields
export interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
  disabled?: boolean;
  metadata?: Record<string, any>;
}

// Base field configuration
export interface BaseFieldConfig {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  validation?: ValidationRule[];
  dependencies?: FieldDependency[];
  metadata?: Record<string, any>;
}

// Specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "phone" | "textarea";
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multiselect" | "radio";
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  maxSelect?: number;
}

export interface GeoFieldConfig extends BaseFieldConfig {
  type: "geo";
  requireAccuracy?: number;
  requiredFields?: Array<keyof GeoLocation>;
}

export interface MediaFieldConfig extends BaseFieldConfig {
  type: "image" | "audio" | "file";
  maxSize?: number;
  acceptedTypes?: string[];
  maxFiles?: number;
  quality?: number;
  compress?: boolean;
}

export interface RelationshipFieldConfig extends BaseFieldConfig {
  type: "relationship";
  relationTo: "building" | "family" | "individual" | "business";
  multiple?: boolean;
  searchFields?: string[];
  displayField?: string;
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | GeoFieldConfig
  | MediaFieldConfig
  | RelationshipFieldConfig;

// Form section and step configuration
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  dependencies?: FieldDependency[];
  collapsed?: boolean;
  metadata?: Record<string, any>;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  dependencies?: FieldDependency[];
  validationMode?: "onChange" | "onBlur" | "onSubmit";
  metadata?: Record<string, any>;
}

// Complete form configuration
export interface FormConfig {
  id: string;
  version: string;
  title: string;
  description?: string;
  type: "building" | "family" | "individual" | "business";
  steps: FormStep[];
  metadata?: {
    category?: string;
    tags?: string[];
    createdBy?: string;
    updatedBy?: string;
    publishedAt?: Date;
    startsAt?: Date;
    endsAt?: Date;
    [key: string]: any;
  };
  settings?: {
    saveAsDraft?: boolean;
    requireLocation?: boolean;
    offlineSupport?: boolean;
    autoSave?: boolean;
    autoSaveInterval?: number;
    mediaUploadStrategy?: "immediate" | "delayed" | "manual";
    validationStrategy?: "immediate" | "onBlur" | "onSubmit";
    [key: string]: any;
  };
}

// Form response types
export interface FieldResponse {
  fieldId: string;
  value: any;
  meta?: {
    skipped?: boolean;
    skipReason?: string;
    location?: GeoLocation;
    timestamp?: Date;
    [key: string]: any;
  };
}

export interface SectionResponse {
  sectionId: string;
  fields: FieldResponse[];
  meta?: Record<string, any>;
}

export interface StepResponse {
  stepId: string;
  sections: SectionResponse[];
  meta?: Record<string, any>;
}

export interface FormResponse {
  formId: string;
  entityId: string;
  entityType: "building" | "family" | "individual" | "business";
  version: string;
  steps: StepResponse[];
  status: "draft" | "completed" | "verified" | "rejected";
  location?: GeoLocation;
  startedAt: Date;
  completedAt?: Date;
  lastModifiedAt: Date;
  submittedBy: string;
  verifiedBy?: string;
  media?: {
    images?: ImageAsset[];
    audio?: AudioAsset[];
    files?: string[];
  };
  metadata?: Record<string, any>;
}

// Form validation context
export interface ValidationContext {
  formData: any;
  entityData?: any;
  user?: any;
  location?: GeoLocation;
  timestamp?: Date;
}

// Form error types
export interface FieldError {
  type: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface FormErrors {
  [fieldId: string]: FieldError;
}
