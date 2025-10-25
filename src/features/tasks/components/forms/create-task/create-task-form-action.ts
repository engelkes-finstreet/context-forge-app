"use server";

import { FormState } from "@/components/forms/types";
import { CreateTaskInput } from "@/features/tasks/components/forms/create-task/create-task-form-schema";
import { typedRedirect, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { revalidatePath } from "next/cache";

export async function createTaskFormAction(
  state: FormState,
  formData: CreateTaskInput,
): Promise<FormState> {
  const result = await TaskService.createTask(formData);

  if (!result.success) {
    console.error("Failed to create task:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${result.data.projectId}`);
  typedRedirect(routes.projects.tasks.detail, {
    projectId: result.data.projectId,
    taskId: result.data.id,
  });
}
