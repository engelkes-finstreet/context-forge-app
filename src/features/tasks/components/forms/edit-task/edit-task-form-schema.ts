import { createTaskSchema } from "@/features/tasks/components/forms/create-task/create-task-form-schema";
import { z } from "zod";

// Extended schema for the edit form that includes metadata
export const editTaskSchema = createTaskSchema.extend({
  id: z.cuid(),
  projectId: z.cuid(),
});

export type EditTaskInput = z.infer<typeof editTaskSchema>;
