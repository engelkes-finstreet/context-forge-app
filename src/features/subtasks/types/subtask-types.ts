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
  progressBarStyle?: 'linear' | 'circular' | 'steps';
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
    type: 'text' | 'textarea' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'date';
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
export interface ModalMetadata extends BaseSubtaskMetadata {
  type: typeof SubtaskType.MODAL;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  triggerType: 'button' | 'link' | 'automatic';
  triggerText?: string; // Text for button/link trigger
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  modalTitle?: string;
  modalDescription?: string;
}

/**
 * Discriminated union of all subtask metadata types
 * TypeScript will narrow the type based on the `type` field
 */
export type SubtaskMetadata =
  | GenericMetadata
  | InquiryProcessMetadata
  | FormMetadata
  | ModalMetadata;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if metadata is for a Generic subtask
 */
export function isGenericMetadata(metadata: SubtaskMetadata | null): metadata is GenericMetadata {
  return metadata?.type === SubtaskType.GENERIC;
}

/**
 * Type guard to check if metadata is for an Inquiry Process subtask
 */
export function isInquiryProcessMetadata(metadata: SubtaskMetadata | null): metadata is InquiryProcessMetadata {
  return metadata?.type === SubtaskType.INQUIRY_PROCESS;
}

/**
 * Type guard to check if metadata is for a Form subtask
 */
export function isFormMetadata(metadata: SubtaskMetadata | null): metadata is FormMetadata {
  return metadata?.type === SubtaskType.FORM;
}

/**
 * Type guard to check if metadata is for a Modal subtask
 */
export function isModalMetadata(metadata: SubtaskMetadata | null): metadata is ModalMetadata {
  return metadata?.type === SubtaskType.MODAL;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create default metadata for a given subtask type
 */
export function createDefaultMetadata(type: SubtaskType): SubtaskMetadata | null {
  switch (type) {
    case SubtaskType.GENERIC:
      // Generic type doesn't need metadata
      return null;

    case SubtaskType.INQUIRY_PROCESS:
      return {
        type: SubtaskType.INQUIRY_PROCESS,
        steps: [],
        progressBarStyle: 'linear',
        allowBackNavigation: true,
        saveProgressOnExit: true,
      };

    case SubtaskType.FORM:
      return {
        type: SubtaskType.FORM,
        fields: [],
        showResetButton: false,
        submitButtonText: 'Submit',
      };

    case SubtaskType.MODAL:
      return {
        type: SubtaskType.MODAL,
        size: 'md',
        triggerType: 'button',
        closeOnOutsideClick: true,
        closeOnEscape: true,
        showCloseButton: true,
      };

    default:
      return null;
  }
}

/**
 * Validate metadata matches the subtask type
 */
export function validateMetadata(type: SubtaskType, metadata: unknown): metadata is SubtaskMetadata {
  if (type === SubtaskType.GENERIC) {
    return metadata === null || metadata === undefined;
  }

  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  const meta = metadata as { type?: SubtaskType };
  return meta.type === type;
}
