import { z } from "zod";

const requestSchema = z.object({
  endpoint: z.string().min(1, "Endpoint is required"),
  requestType: z.string().min(1, "Request type is required"),
  paginated: z.boolean(),
  protected: z.boolean(),
  resultSchema: z.boolean(),
});

export type Request = z.infer<typeof requestSchema>;

const requestsSchema = z.array(requestSchema);

export type Requests = z.infer<typeof requestsSchema>;

export const createRequestSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  requests: requestsSchema,
});

export const updateRequestSubtaskFormSchema =
  createRequestSubtaskFormSchema.extend({
    subtaskId: z.cuid("Invalid subtask ID"),
  });

export type CreateRequestSubtaskFormInput = z.infer<
  typeof createRequestSubtaskFormSchema
>;

export type UpdateRequestSubtaskFormInput = z.infer<
  typeof updateRequestSubtaskFormSchema
>;
