import { z } from "zod";

const modalMetadataSchema = z.object({
  dataTypes: z.array(
    z.object({
      keyName: z.string().min(1, "Key name is required"),
      dataType: z.string().min(1, "Data type is required"),
    }),
  ),
  withOpenButton: z.boolean(),
  contentDescription: z.string().optional(),
});

export const createModalSubtaskFormSchema = z.object({
  taskId: z.string(),
  modalName: z.string().min(1, "Modal name is required"),
  metadata: modalMetadataSchema,
});

export type ModalSubtaskMetadata = z.infer<typeof modalMetadataSchema>;

export const updateModalSubtaskFormSchema =
  createModalSubtaskFormSchema.safeExtend({
    subtaskId: z.cuid(),
  });

export type CreateModalSubtaskFormInput = z.infer<
  typeof createModalSubtaskFormSchema
>;

export type UpdateModalSubtaskFormInput = z.infer<
  typeof updateModalSubtaskFormSchema
>;
