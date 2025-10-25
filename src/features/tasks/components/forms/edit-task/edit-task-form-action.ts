"use server";

import { FormState } from "@/components/forms/types";
import { EditTaskInput } from "@/features/tasks/components/forms/edit-task/edit-task-form-schema";
import { TaskService } from "@/lib/services/task-service";
import { revalidatePath } from "next/cache";

export async function editTaskFormAction(
  state: FormState,
  formData: EditTaskInput,
): Promise<FormState> {
  const { id, projectId, ...updateData } = formData;
  const result = await TaskService.updateTask(id, updateData);

  if (!result.success) {
    console.error("Failed to update task:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${id}`);
  revalidatePath(`/projects/${projectId}`);

  return {
    error: null,
    message: "Task updated successfully",
  };
}
