import { z } from "zod";

const requestSchema = z.object({
  endpoint: z.string().min(1, "Endpoint is required"),
  requestType: z.string().min(1, "Request type is required"),
  paginated: z.boolean(),
  protected: z.boolean(),
  resultSchema: z.boolean(),
});

const databaseRequestSchema = requestSchema.extend({
  httpMethod: z.string().min(1, "HTTP method is required"),
});

export type Request = z.infer<typeof requestSchema>;

const requestsSchema = z.array(requestSchema);

const metadataSchema = z.object({
  requests: requestsSchema,
});

const requestDatabaseMetadataSchema = z.object({
  requests: z.array(databaseRequestSchema),
});

export type RequestDatabaseMetadata = z.infer<
  typeof requestDatabaseMetadataSchema
>;

export type Requests = z.infer<typeof requestsSchema>;
export type RequestSubtaskMetadata = z.infer<typeof metadataSchema>;

export const createRequestSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  metadata: metadataSchema,
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
