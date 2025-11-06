import { z } from "zod";

const columnSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  translation: z.string().min(1, "Translation is required"),
  gridTemplateColumns: z.number().min(1, "Number of grid columns is required"),
});

export type Column = z.infer<typeof columnSchema>;

const columnsSchema = z.array(columnSchema);

export type Columns = z.infer<typeof columnsSchema>;

const metadataSchema = z.object({
  columns: columnsSchema,
  noItemTranslation: z.string().min(1, "No item translation is required"),
});

export type InteractiveListMetadata = z.infer<typeof metadataSchema>;

export const createInteractiveListSubtaskFormSchema = z
  .object({
    taskId: z.string().cuid("Invalid task ID"),
    subtaskName: z.string().min(1, "Subtask name is required"),
    metadata: metadataSchema,
  })
  .superRefine((data, ctx) => {
    const totalColumns = data.metadata.columns.reduce(
      (sum, column) => sum + column.gridTemplateColumns,
      0,
    );

    if (totalColumns !== 12) {
      ctx.addIssue({
        code: "custom",
        message: `Grid columns must sum to 12 (currently ${totalColumns})`,
        path: ["columns"],
      });
    }
  });

export const updateInteractiveListSubtaskFormSchema =
  createInteractiveListSubtaskFormSchema.safeExtend({
    subtaskId: z.cuid("Invalid subtask ID"),
  });

export type CreateInteractiveListSubtaskFormInput = z.infer<
  typeof createInteractiveListSubtaskFormSchema
>;

export type UpdateInteractiveListSubtaskFormInput = z.infer<
  typeof updateInteractiveListSubtaskFormSchema
>;
