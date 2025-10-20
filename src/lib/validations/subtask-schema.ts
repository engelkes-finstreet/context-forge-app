import { z } from "zod";

export const createSubtaskSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  name: z.string().min(1, "Subtask name is required").max(200, "Subtask name must be less than 200 characters"),
  content: z.string().min(1, "Content is required"),
  order: z.number().int().min(0).default(0).optional(),
});

export const updateSubtaskSchema = z.object({
  name: z.string().min(1, "Subtask name is required").max(200, "Subtask name must be less than 200 characters").optional(),
  content: z.string().optional(),
  order: z.number().int().min(0).optional(),
});

export const reorderSubtaskSchema = z.object({
  subtaskId: z.string().cuid("Invalid subtask ID"),
  newOrder: z.number().int().min(0),
});

export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;
export type ReorderSubtaskInput = z.infer<typeof reorderSubtaskSchema>;
