"use server";

import { FormState } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";

export async function createFormSubtaskFormAction(
  state: FormState,
  formData: CreateFormSubtaskFormInput,
): Promise<FormState> {
  console.log({ formData: JSON.stringify(formData, null, 2) });
  return { error: null, message: "Subtask created successfully" };
}
