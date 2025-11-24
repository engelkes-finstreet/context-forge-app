/**
 * Subtask Type System
 *
 * This file defines the type system for subtasks, including:
 * - SubtaskType enum (matches Prisma enum)
 * - Metadata interfaces for each type
 * - Discriminated union for type safety
 * - Type guards for runtime validation
 */

import { SubtaskType } from "@prisma/client";
import { PageType } from "@/features/subtasks/forms/page-subtask/use-page-type-options";

// ============================================================================
// Metadata Interfaces (Discriminated Union)
// ============================================================================

/**
 * Base interface for all subtask metadata
 */
interface BaseSubtaskMetadata {
  type: SubtaskType;
}

/**
 * Generic subtask metadata
 * Generic subtasks don't need additional metadata beyond name and content
 */
export interface GenericMetadata extends BaseSubtaskMetadata {
  type: typeof SubtaskType.GENERIC;
}

/**
 * Inquiry Process subtask metadata
 * Represents a multi-step form wizard with progress tracking
 */
export interface InquiryProcessMetadata extends BaseSubtaskMetadata {
  type: typeof SubtaskType.INQUIRY_PROCESS;
  steps: Array<{
    id: string;
    name: string;
    description?: string;
    order: number;
  }>;
  progressBarStyle?: "linear" | "circular" | "steps";
  currentStep?: string; // ID of the current step
  allowBackNavigation?: boolean;
  saveProgressOnExit?: boolean;
}

/**
 * Form subtask metadata
 * Represents a single form with field definitions and validation
 */
export interface FormMetadata extends BaseSubtaskMetadata {
  type: typeof SubtaskType.FORM;
  fields: Array<{
    name: string;
    type:
      | "text"
      | "textarea"
      | "email"
      | "password"
      | "number"
      | "select"
      | "checkbox"
      | "radio"
      | "date";
    label: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    validation?: string; // JSON schema or regex pattern
    options?: Array<{ label: string; value: string }>; // For select/radio
  }>;
  submitEndpoint?: string; // API endpoint to submit to
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
}

/**
 * Modal subtask metadata
 * Represents a modal dialog or popup component
 */
export interface ModalMetadata {
  dataTypes: Array<{
    keyName: string;
    dataType: string;
  }>;
  withOpenButton: boolean;
  translations: {
    title: string;
    subheading?: string;
    confirmButton: string;
  };
  contentDescription?: string;
}

/**
 * Simple Form subtask metadata
 * Represents a simple form configuration with basic fields
 */
export interface SimpleFormMetadata {
  simpleFormName: string;
  swaggerPath: string;
  description: string;
}

/**
 * Page subtask metadata
 * Represents a page configuration with different types (inquiry or portal)
 */
export interface PageMetadata {
  pageType: PageType;
  translations: {
    title: string;
    description?: string; // Only for inquiry pages
  };
}

/**
 * Discriminated union of all subtask metadata types
 * TypeScript will narrow the type based on the `type` field
 */
export type SubtaskMetadata =
  | GenericMetadata
  | InquiryProcessMetadata
  | FormMetadata
  | ModalMetadata
  | SimpleFormMetadata
  | PageMetadata;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate metadata matches the subtask type
 */
export function validateMetadata(
  type: SubtaskType,
  metadata: unknown,
): metadata is SubtaskMetadata {
  if (type === SubtaskType.GENERIC) {
    return metadata === null || metadata === undefined;
  }

  if (!metadata || typeof metadata !== "object") {
    return false;
  }

  const meta = metadata as { type?: SubtaskType };
  return meta.type === type;
}
