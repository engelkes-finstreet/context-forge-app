"use server";

import { FormState } from "@/components/forms/types";
import { CreateGenericSubtaskFormInput } from "@/features/subtasks/forms/generic-subtask/create-generic-subtask-form-schema";

export async function createGenericSubtaskFormAction(
  state: FormState,
  formData: CreateGenericSubtaskFormInput,
): Promise<FormState> {
  return {
    error: null,
    message: "Subtask created successfully",
  };
}
