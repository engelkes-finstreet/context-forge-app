import { z } from "zod";
import { PageType } from "@/features/subtasks/forms/page-subtask/use-page-type-options";

const pageTypeSchema = z.enum(PageType);

const pageMetadataSchema = z
  .object({
    pageType: pageTypeSchema,
    translations: z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      // Description is required for inquiry pages
      if (data.pageType === PageType.INQUIRY) {
        return (
          data.translations.description !== undefined &&
          data.translations.description.length > 0
        );
      }
      return true;
    },
    {
      message: "Description is required for inquiry pages",
      path: ["translations", "description"],
    },
  );

export const createPageSubtaskFormSchema = z.object({
  taskId: z.cuid("Invalid task ID"),
  pageName: z.string().min(1, "Page name is required"),
  metadata: pageMetadataSchema,
});

export const updatePageSubtaskFormSchema = createPageSubtaskFormSchema.extend({
  subtaskId: z.cuid("Invalid subtask ID"),
});

export type PageSubtaskMetadata = z.infer<typeof pageMetadataSchema>;
export type CreatePageSubtaskFormInput = z.infer<
  typeof createPageSubtaskFormSchema
>;
export type UpdatePageSubtaskFormInput = z.infer<
  typeof updatePageSubtaskFormSchema
>;
