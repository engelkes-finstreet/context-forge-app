import { z } from "zod";

/**
 * Update Project Form Schema
 *
 * Validates user input for updating an existing project.
 * Used by the edit project form for runtime validation.
 */
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .optional(),
  description: z.string().optional(),
  githubRepo: z.string().optional(),
  swaggerPath: z.string().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
