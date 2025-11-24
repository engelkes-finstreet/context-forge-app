import { z } from "zod";

const metadataSchema = z.object({
  context: z.string().min(1, "Context is required"),
});

export const createGenericSubtaskFormSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  metadata: metadataSchema,
});

export type GenericSubtaskMetadata = z.infer<typeof metadataSchema>;

export type CreateGenericSubtaskFormInput = z.infer<
  typeof createGenericSubtaskFormSchema
>;
