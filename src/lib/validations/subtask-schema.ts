import { z } from "zod";
import { SubtaskType } from "@/features/subtasks/types/subtask-types";

const inquiryProcessMetadataSchema = z.object({
  type: z.literal(SubtaskType.INQUIRY_PROCESS),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    order: z.number().int().min(0),
  })),
  progressBarStyle: z.enum(['linear', 'circular', 'steps']).optional(),
  currentStep: z.string().optional(),
  allowBackNavigation: z.boolean().optional(),
  saveProgressOnExit: z.boolean().optional(),
});

const formMetadataSchema = z.object({
  type: z.literal(SubtaskType.FORM),
  fields: z.array(z.object({
    name: z.string(),
    type: z.enum(['text', 'textarea', 'email', 'password', 'number', 'select', 'checkbox', 'radio', 'date']),
    label: z.string(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    validation: z.string().optional(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  })),
  submitEndpoint: z.string().optional(),
  submitButtonText: z.string().optional(),
  resetButtonText: z.string().optional(),
  showResetButton: z.boolean().optional(),
});

const modalMetadataSchema = z.object({
  type: z.literal(SubtaskType.MODAL),
  size: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional(),
  triggerType: z.enum(['button', 'link', 'automatic']),
  triggerText: z.string().optional(),
  closeOnOutsideClick: z.boolean().optional(),
  closeOnEscape: z.boolean().optional(),
  showCloseButton: z.boolean().optional(),
  modalTitle: z.string().optional(),
  modalDescription: z.string().optional(),
});

// Discriminated union for metadata
const metadataSchema = z.discriminatedUnion("type", [
  inquiryProcessMetadataSchema,
  formMetadataSchema,
  modalMetadataSchema,
]).nullable().optional();

/**
 * Database Schema for Creating a Subtask
 *
 * This schema validates the complete subtask data before saving to the database.
 * This is typically constructed by server actions after transforming form input.
 *
 * Note: This is NOT the form schema. Forms use type-specific schemas from /forms/*.
 */
export const createSubtaskSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  name: z.string().min(1, "Subtask name is required").max(200, "Subtask name must be less than 200 characters"),
  type: z.nativeEnum(SubtaskType).default(SubtaskType.GENERIC),
  content: z.string().min(1, "Content is required"),
  metadata: metadataSchema,
  order: z.number().int().min(0).default(0).optional(),
});

export const updateSubtaskSchema = z.object({
  name: z.string().min(1, "Subtask name is required").max(200, "Subtask name must be less than 200 characters").optional(),
  content: z.string().optional(),
  metadata: metadataSchema,
  order: z.number().int().min(0).optional(),
  // Note: type is NOT included here - it's immutable after creation
});

export const reorderSubtaskSchema = z.object({
  subtaskId: z.string().cuid("Invalid subtask ID"),
  newOrder: z.number().int().min(0),
});

export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;
export type ReorderSubtaskInput = z.infer<typeof reorderSubtaskSchema>;
