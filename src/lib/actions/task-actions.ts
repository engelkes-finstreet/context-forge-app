"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskService } from "@/lib/services/task-service";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task-schema";

export type TaskFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createTaskAction(
  state: TaskFormState,
  data: CreateTaskInput
): Promise<TaskFormState> {
  let task;

  try {
    task = await TaskService.createTask(data);
  } catch (error) {
    console.error("Failed to create task:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create task",
      message: null,
    };
  }

  revalidatePath(`/projects/${task.projectId}`);
  redirect(`/projects/${task.projectId}/tasks/${task.id}`);
}

export async function updateTaskAction(
  state: TaskFormState,
  data: UpdateTaskInput & { id: string; projectId: string }
): Promise<TaskFormState> {
  try {
    const { id, projectId, ...updateData } = data;
    await TaskService.updateTask(id, updateData);

    revalidatePath(`/projects/${projectId}/tasks/${id}`);
    revalidatePath(`/projects/${projectId}`);

    return {
      error: null,
      message: "Task updated successfully",
    };
  } catch (error) {
    console.error("Failed to update task:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update task",
      message: null,
    };
  }
}

export async function deleteTask(id: string): Promise<{ error: string | null }> {
  let projectId: string;

  try {
    const task = await TaskService.getTaskById(id);
    if (!task) {
      return {
        error: "Task not found",
      };
    }

    projectId = task.projectId;
    await TaskService.deleteTask(id);
  } catch (error) {
    console.error("Failed to delete task:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function reorderTasks(
  projectId: string,
  taskIds: string[]
): Promise<{ error: string | null }> {
  try {
    await TaskService.reorderTasks(projectId, taskIds);
  } catch (error) {
    console.error("Failed to reorder tasks:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to reorder tasks",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}
