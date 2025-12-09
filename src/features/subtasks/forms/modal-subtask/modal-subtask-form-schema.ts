import { z } from "zod";

const modalMetadataSchema = z.object({
  dataTypes: z.array(
    z.object({
      keyName: z.string().optional(),
      dataType: z.string().optional(),
    }),
  ),
  withOpenButton: z.boolean(),
  translations: z.object({
    title: z.string().min(1, "Title is required"),
    subheading: z.string().optional(),
    confirmButton: z.string().optional(),
  }),
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
