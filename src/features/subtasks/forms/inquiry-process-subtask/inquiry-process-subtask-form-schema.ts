import { z } from "zod";

const stepSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  routeName: z.string().min(1, "Route name is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type Step = z.infer<typeof stepSchema>;

const stepsSchema = z.array(stepSchema);

export type Steps = z.infer<typeof stepsSchema>;

const progressBarGroupSchema = z.object({
  groupTitle: z.string().min(1, "Group title is required"),
});

export type ProgressBarGroup = z.infer<typeof progressBarGroupSchema>;

const progressBarSchema = z.array(progressBarGroupSchema);

export type ProgressBar = z.infer<typeof progressBarSchema>;

const metadataSchema = z.object({
  inquiryRoute: z.string().min(1, "Inquiry route is required"),
  steps: stepsSchema,
  progressBar: progressBarSchema,
});

export type InquiryProcessMetadata = z.infer<typeof metadataSchema>;

export const createInquiryProcessSubtaskFormSchema = z.object({
  taskId: z.string().cuid("Invalid task ID"),
  subtaskName: z.string().min(1, "Subtask name is required"),
  metadata: metadataSchema,
});

export const updateInquiryProcessSubtaskFormSchema =
  createInquiryProcessSubtaskFormSchema.extend({
    subtaskId: z.cuid("Invalid subtask ID"),
  });

export type CreateInquiryProcessSubtaskFormInput = z.infer<
  typeof createInquiryProcessSubtaskFormSchema
>;

export type UpdateInquiryProcessSubtaskFormInput = z.infer<
  typeof updateInquiryProcessSubtaskFormSchema
>;
