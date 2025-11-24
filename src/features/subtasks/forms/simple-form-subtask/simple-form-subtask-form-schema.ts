import { z } from "zod";

const simpleFormMetadataSchema = z.object({
  simpleFormName: z.string().min(1, "Simple form name is required"),
  swaggerPath: z.string().min(1, "Swagger path is required"),
  description: z.string().min(1, "Description is required"),
});

export const createSimpleFormSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  metadata: simpleFormMetadataSchema,
});

export const updateSimpleFormSubtaskFormSchema =
  createSimpleFormSubtaskFormSchema.extend({
    subtaskId: z.cuid("Invalid subtask ID"),
  });

export type SimpleFormSubtaskMetadata = z.infer<
  typeof simpleFormMetadataSchema
>;
export type CreateSimpleFormSubtaskFormInput = z.infer<
  typeof createSimpleFormSubtaskFormSchema
>;
export type UpdateSimpleFormSubtaskFormInput = z.infer<
  typeof updateSimpleFormSubtaskFormSchema
>;
