import { z } from "zod";
import { customFieldDefinitionSchema } from "@/lib/validations/custom-fields";

/**
 * Create Project Form Schema
 *
 * Validates user input for creating a new project.
 * Used by the create project form for runtime validation.
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters"),
  description: z.string().optional(),
  githubRepo: z.string().optional(),
  swaggerPath: z.string().optional(),
  customFieldDefinitions: z
    .object({
      fields: z.array(customFieldDefinitionSchema),
    })
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
