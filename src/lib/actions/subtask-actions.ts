"use server";

import { revalidatePath } from "next/cache";
import { typedRedirect, routes } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import type { CreateGenericSubtaskFormInput } from "@/features/subtasks/components/forms/generic-subtask/create-generic-subtask-form-schema";
import { Prisma, SubtaskType } from "@prisma/client";

export type SubtaskFormState = {
  error: string | null;
  message: string | null;
} | null;

/**
 * Create Generic Subtask Action
 *
 * Transforms form input (CreateGenericSubtaskFormInput) into database input (Prisma.SubtaskUncheckedCreateInput)
 * by adding the type and metadata fields.
 *
 * Flow:
 * 1. Receive form data from user
 * 2. Add type: GENERIC and metadata: null
 * 3. Create subtask via service
 * 4. Redirect to task detail page
 */
export async function createGenericSubtaskAction(
  state: SubtaskFormState,
  formData: CreateGenericSubtaskFormInput,
): Promise<SubtaskFormState> {
  // Transform form input to database input
  const subtaskInput: Prisma.SubtaskUncheckedCreateInput = {
    ...formData,
    type: SubtaskType.GENERIC,
    metadata: {}, // Generic type has no metadata
  };

  const result = await SubtaskService.createSubtask(subtaskInput);

  if (!result.success) {
    console.error("Failed to create subtask:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  // Get task to find projectId for revalidation
  const subtask = await SubtaskService.getSubtaskById(result.data.id);
  const task = subtask?.task;

  if (task) {
    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
    typedRedirect(routes.projects.tasks.detail, {
      projectId: task.projectId,
      taskId: task.id,
    });
  }

  return {
    error: null,
    message: "Subtask created successfully",
  };
}

/**
 * @deprecated Use type-specific actions (createGenericSubtaskAction, etc.) instead
 */
export async function createSubtaskAction(
  state: SubtaskFormState,
  data: Prisma.SubtaskUncheckedCreateInput,
): Promise<SubtaskFormState> {
  const result = await SubtaskService.createSubtask(data);

  if (!result.success) {
    console.error("Failed to create subtask:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  // Get task to find projectId for revalidation
  const subtask = await SubtaskService.getSubtaskById(result.data.id);
  const task = subtask?.task;

  if (task) {
    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
    typedRedirect(routes.projects.tasks.detail, {
      projectId: task.projectId,
      taskId: task.id,
    });
  }

  return {
    error: null,
    message: "Subtask created successfully",
  };
}

export async function updateSubtaskAction(
  state: SubtaskFormState,
  data: Prisma.SubtaskUncheckedUpdateInput & {
    id: string;
    taskId: string;
    projectId: string;
  },
): Promise<SubtaskFormState> {
  const { id, taskId, projectId, ...updateData } = data;
  const result = await SubtaskService.updateSubtask(id, updateData);

  if (!result.success) {
    console.error("Failed to update subtask:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

  return {
    error: null,
    message: "Subtask updated successfully",
  };
}

export async function deleteSubtask(
  id: string,
  projectId: string,
  taskId: string,
): Promise<{ error: string | null }> {
  const result = await SubtaskService.deleteSubtask(id);

  if (!result.success) {
    console.error("Failed to delete subtask:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { error: null };
}

export async function reorderSubtasks(
  taskId: string,
  projectId: string,
  subtaskIds: string[],
): Promise<{ error: string | null }> {
  const result = await SubtaskService.reorderSubtasks(taskId, subtaskIds);

  if (!result.success) {
    console.error("Failed to reorder subtasks:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { error: null };
}
