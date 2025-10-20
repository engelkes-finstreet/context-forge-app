"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SubtaskService } from "@/lib/services/subtask-service";
import type { CreateSubtaskInput, UpdateSubtaskInput } from "@/lib/validations/subtask-schema";

export type SubtaskFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createSubtaskAction(
  state: SubtaskFormState,
  data: CreateSubtaskInput
): Promise<SubtaskFormState> {
  try {
    const subtask = await SubtaskService.createSubtask(data);

    // Get task to find projectId for revalidation
    const task = await SubtaskService.getSubtaskById(subtask.id).then((s) => s?.task);
    if (task) {
      revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
      redirect(`/projects/${task.projectId}/tasks/${task.id}`);
    }

    return {
      error: null,
      message: "Subtask created successfully",
    };
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create subtask",
      message: null,
    };
  }
}

export async function updateSubtaskAction(
  state: SubtaskFormState,
  data: UpdateSubtaskInput & { id: string; taskId: string; projectId: string }
): Promise<SubtaskFormState> {
  try {
    const { id, taskId, projectId, ...updateData } = data;
    await SubtaskService.updateSubtask(id, updateData);

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      error: null,
      message: "Subtask updated successfully",
    };
  } catch (error) {
    console.error("Failed to update subtask:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update subtask",
      message: null,
    };
  }
}

export async function deleteSubtask(id: string): Promise<{ error: string | null }> {
  try {
    const subtask = await SubtaskService.getSubtaskById(id);
    if (!subtask) {
      return {
        error: "Subtask not found",
      };
    }

    const task = subtask.task;
    await SubtaskService.deleteSubtask(id);

    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);

    return { error: null };
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete subtask",
    };
  }
}

export async function reorderSubtasks(
  taskId: string,
  subtaskIds: string[]
): Promise<{ error: string | null }> {
  try {
    await SubtaskService.reorderSubtasks(taskId, subtaskIds);

    // Get task to find projectId for revalidation
    const subtask = await SubtaskService.getSubtasksByTaskId(taskId).then((s) => s[0]);
    if (subtask) {
      const fullSubtask = await SubtaskService.getSubtaskById(subtask.id);
      if (fullSubtask?.task) {
        revalidatePath(`/projects/${fullSubtask.task.projectId}/tasks/${taskId}`);
      }
    }

    return { error: null };
  } catch (error) {
    console.error("Failed to reorder subtasks:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to reorder subtasks",
    };
  }
}
