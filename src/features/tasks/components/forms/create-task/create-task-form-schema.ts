import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.cuid("Invalid project ID"),
  name: z
    .string()
    .min(1, "Task name is required")
    .max(200, "Task name must be less than 200 characters"),
  featureName: z.string().min(1, "Feature name is required"),
  product: z.string().optional(),
  role: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
