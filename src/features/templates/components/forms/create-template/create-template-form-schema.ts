import { z } from "zod";
import { SubtaskType } from "@prisma/client";

/**
 * Schema for a single subtask template within a task template
 */
export const subtaskTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Subtask name is required")
    .max(200, "Subtask name must be less than 200 characters"),
  type: z.nativeEnum(SubtaskType, {
    errorMap: () => ({ message: "Invalid subtask type" }),
  }),
  content: z.string().min(1, "Content is required"),
  metadata: z.any().nullable().optional(),
  order: z.number().int().min(0),
  required: z.boolean().default(true),
});

/**
 * Schema for creating a task template
 */
export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(200, "Template name must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .nullable(),
  subtaskTemplates: z
    .array(subtaskTemplateSchema)
    .min(1, "At least one subtask template is required"),
});

export type SubtaskTemplateInput = z.infer<typeof subtaskTemplateSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
