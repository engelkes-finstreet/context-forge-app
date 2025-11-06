"use server";

import { FormState } from "@/components/forms/types";
import {
  CreateTaskInput,
  UpdateTaskInput,
} from "@/features/tasks/components/forms/task-form-schema";
import { typedRedirect, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { revalidatePath } from "next/cache";

export async function createTaskFormAction(
  state: FormState,
  formData: CreateTaskInput,
): Promise<FormState> {
  const result = await TaskService.createTask({
    projectId: formData.projectId,
    name: formData.name,
    featureName: formData.featureName,
    product: formData.product,
    role: formData.role,
  });

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

export async function updateTaskFormAction(
  state: FormState,
  formData: UpdateTaskInput,
): Promise<FormState> {
  const result = await TaskService.updateTask(formData.taskId, {
    name: formData.name,
    featureName: formData.featureName,
    product: formData.product,
    role: formData.role,
  });

  if (!result.success) {
    console.error("Failed to update task:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${formData.projectId}/tasks/${formData.taskId}`);
  revalidatePath(`/projects/${formData.projectId}`);
  typedRedirect(routes.projects.tasks.detail, {
    projectId: formData.projectId,
    taskId: formData.taskId,
  });
}
