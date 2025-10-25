import { FormState } from "@/components/forms/types";
import { z } from "zod";

export const newSubtaskFormSchema = z.object({
  featureName: z.string().min(1, "Feature name is required"),
  product: z.string().min(1, "Product is required"),
  role: z.string().min(1, "Role is required"),
  subtaskType: z.string().min(1, "Subtask type is required"),
  taskId: z.cuid("Invalid task ID"),
});

export type NewSubtaskFormInput = z.infer<typeof newSubtaskFormSchema>;
export type NewSubtaskFormState = FormState;
