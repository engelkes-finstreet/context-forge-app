"use server";

import { revalidatePath } from "next/cache";
import { typedRedirect, routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { Prisma } from "@prisma/client";

export type TaskFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createTaskAction(
  state: TaskFormState,
  data: Prisma.TaskUncheckedCreateInput,
): Promise<TaskFormState> {
  const result = await TaskService.createTask(data);

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

export async function updateTaskAction(
  state: TaskFormState,
  data: Prisma.TaskUncheckedUpdateInput & { id: string; projectId: string },
): Promise<TaskFormState> {
  const { id, projectId, ...updateData } = data;
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

export async function deleteTask(
  id: string,
  projectId: string,
): Promise<{ error: string | null }> {
  const result = await TaskService.deleteTask(id);

  if (!result.success) {
    console.error("Failed to delete task:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath(`/projects/${projectId}`);
  typedRedirect(routes.projects.detail, { projectId });
}

export async function reorderTasks(
  projectId: string,
  taskIds: string[],
): Promise<{ error: string | null }> {
  const result = await TaskService.reorderTasks(projectId, taskIds);

  if (!result.success) {
    console.error("Failed to reorder tasks:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}
