import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().cuid("Invalid project ID"),
  name: z.string().min(1, "Task name is required").max(200, "Task name must be less than 200 characters"),
  sharedContext: z.string().min(1, "Shared context is required"),
  order: z.number().int().min(0).default(0).optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().min(1, "Task name is required").max(200, "Task name must be less than 200 characters").optional(),
  sharedContext: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderTaskSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  newOrder: z.number().int().min(0),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;
