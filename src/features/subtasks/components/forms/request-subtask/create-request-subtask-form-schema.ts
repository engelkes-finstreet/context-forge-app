import { z } from "zod";

export const createRequestSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  name: z
    .string()
    .min(1, "Subtask name is required")
    .max(200, "Subtask name must be less than 200 characters"),
  requests: z.array(
    z.object({
      endpoint: z.string().min(1, "Endpoint is required"),
      requestType: z.string().min(1, "Request type is required"),
      paginated: z.boolean(),
    }),
  ),
});

export type CreateRequestSubtaskFormInput = z.infer<
  typeof createRequestSubtaskFormSchema
>;
