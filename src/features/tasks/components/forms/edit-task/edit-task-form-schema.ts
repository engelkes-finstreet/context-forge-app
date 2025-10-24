import { z } from "zod";

/**
 * Update Task Form Schema
 *
 * Validates user input for updating an existing task.
 * Used by the edit task form for runtime validation.
 */
export const updateTaskSchema = z.object({
  name: z
    .string()
    .min(1, "Task name is required")
    .max(200, "Task name must be less than 200 characters")
    .optional(),
  sharedContext: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
