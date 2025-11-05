import { z } from "zod";

const columnSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  translation: z.string().min(1, "Translation is required"),
  gridTemplateColumns: z.number().min(1, "Number of grid columns is required"),
});

export type Column = z.infer<typeof columnSchema>;

const columnsSchema = z.array(columnSchema);

export type Columns = z.infer<typeof columnsSchema>;

export const createPresentationListSubtaskFormSchema = z
  .object({
    taskId: z.string().cuid("Invalid task ID"),
    subtaskName: z.string().min(1, "Subtask name is required"),
    columns: columnsSchema,
    noItemTranslation: z.string().min(1, "No item translation is required"),
  })
  .superRefine((data, ctx) => {
    const totalColumns = data.columns.reduce(
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

export const updatePresentationListSubtaskFormSchema =
  createPresentationListSubtaskFormSchema.safeExtend({
    subtaskId: z.cuid("Invalid subtask ID"),
  });

export type CreatePresentationListSubtaskFormInput = z.infer<
  typeof createPresentationListSubtaskFormSchema
>;

export type UpdatePresentationListSubtaskFormInput = z.infer<
  typeof updatePresentationListSubtaskFormSchema
>;
