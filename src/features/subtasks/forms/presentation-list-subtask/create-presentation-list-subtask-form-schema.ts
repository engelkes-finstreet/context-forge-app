import { z } from "zod";

export const createPresentationListSubtaskFormSchema = z
  .object({
    taskId: z.string().cuid("Invalid task ID"),
    subtaskName: z.string().min(1, "Subtask name is required"),
    columns: z.array(
      z.object({
        name: z.string().min(1, "Column name is required"),
        translation: z.string().min(1, "Translation is required"),
        gridTemplateColumns: z
          .number()
          .min(1, "Number of grid columns is required"),
      }),
    ),
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

export type CreatePresentationListSubtaskFormInput = z.infer<
  typeof createPresentationListSubtaskFormSchema
>;
