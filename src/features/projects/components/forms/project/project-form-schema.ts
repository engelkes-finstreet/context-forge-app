import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z.string().optional(),
  feGithubRepo: z.string().optional(),
  beGithubRepo: z.string().optional(),
  swaggerPath: z.string().optional(),
  routesPath: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.safeExtend({
  projectId: z.cuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
