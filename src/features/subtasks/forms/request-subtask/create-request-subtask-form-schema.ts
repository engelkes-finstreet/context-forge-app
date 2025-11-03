import { z } from "zod";

export const createRequestSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  requests: z.array(
    z.object({
      endpoint: z.string().min(1, "Endpoint is required"),
      requestType: z.string().min(1, "Request type is required"),
      paginated: z.boolean(),
      protected: z.boolean(),
      resultSchema: z.boolean()
    }),
  ),
});

export type CreateRequestSubtaskFormInput = z.infer<
  typeof createRequestSubtaskFormSchema
>;
