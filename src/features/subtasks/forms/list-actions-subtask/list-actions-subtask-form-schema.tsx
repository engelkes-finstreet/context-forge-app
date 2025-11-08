import { z } from "zod";

const listActionsMetadataSchema = z.object({
  pagePath: z.string().min(1, "Page path is required"),
  withSearch: z.boolean(),
  withSort: z.boolean(),
  withGrouping: z.boolean(),
  interactiveLists: z.array(
    z.object({
      swaggerPath: z.string().min(1, "Swagger path is required"),
      name: z.string().min(1, "Name is required"),
    }),
  ),
});

export const listActionsSubtaskFormSchema = z.object({
  taskId: z.string(),
  listActionsName: z.string().min(1, "List actions name is required"),
  metadata: listActionsMetadataSchema,
});

export const updateListActionsSubtaskFormSchema =
  listActionsSubtaskFormSchema.safeExtend({
    subtaskId: z.string(),
  });

export type ListActionsSubtaskMetadata = z.infer<
  typeof listActionsMetadataSchema
>;
export type CreateListActionsSubtaskFormInput = z.infer<
  typeof listActionsSubtaskFormSchema
>;
export type UpdateListActionsSubtaskFormInput = z.infer<
  typeof updateListActionsSubtaskFormSchema
>;
