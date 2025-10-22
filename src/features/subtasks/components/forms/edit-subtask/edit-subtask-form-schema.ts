import { z } from "zod";

/**
 * Update Subtask Form Schema
 *
 * Validates user input for updating an existing subtask.
 * Used by the edit subtask form for runtime validation.
 *
 * Note: Type is NOT included here - it's immutable after creation
 */
export const updateSubtaskSchema = z.object({
  name: z.string().min(1, "Subtask name is required").max(200, "Subtask name must be less than 200 characters").optional(),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;
