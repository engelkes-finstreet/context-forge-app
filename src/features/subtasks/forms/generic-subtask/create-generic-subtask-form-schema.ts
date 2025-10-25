import { z } from "zod";

/**
 * Generic Subtask Form Schema
 *
 * This schema validates user input from the Generic subtask creation form.
 * It contains only the fields that the user directly inputs.
 *
 * The server action will transform this into CreateSubtaskInput by adding:
 * - type: SubtaskType.GENERIC
 * - metadata: null
 */
export const createGenericSubtaskFormSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  subtaskId: z.string().cuid("Invalid subtask ID"),
});

/**
 * Type inference for the generic subtask form input
 * This is what the form collects from the user
 */
export type CreateGenericSubtaskFormInput = z.infer<
  typeof createGenericSubtaskFormSchema
>;
