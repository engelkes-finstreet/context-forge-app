import { z } from "zod";

export const createInquiryProcessSubtaskFormSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  inquiryRoute: z.string().min(1, "Inquiry route is required"),
  steps: z.array(
    z.object({
      name: z.string().min(1, "Step name is required"),
      routeName: z.string().min(1, "Route name is required"),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
    }),
  ),
  progressBar: z.array(
    z.object({
      groupTitle: z.string().min(1, "Group title is required"),
    }),
  ),
});

export type CreateInquiryProcessSubtaskFormInput = z.infer<
  typeof createInquiryProcessSubtaskFormSchema
>;
