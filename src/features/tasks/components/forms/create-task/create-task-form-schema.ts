import { z } from "zod";

/**
 * Create Task Form Schema
 *
 * Validates user input for creating a new task.
 * Used by the create task form for runtime validation.
 */
export const createTaskSchema = z.object({
  projectId: z.string().cuid("Invalid project ID"),
  name: z.string().min(1, "Task name is required").max(200, "Task name must be less than 200 characters"),
  sharedContext: z.string().min(1, "Shared context is required"),
  order: z.number().int().min(0).default(0).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
