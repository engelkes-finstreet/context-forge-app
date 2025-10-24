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
  let subtask;
  let task;

  try {
    // Extract customFields and remove from main data
    const { customFields, ...subtaskData } = formData;

    // Transform form input to database input
    const subtaskInput: Prisma.SubtaskUncheckedCreateInput = {
      ...subtaskData,
      type: SubtaskType.GENERIC,
      metadata: {
        customFields: customFields || {}, // Store custom fields in metadata
      },
    };

    subtask = await SubtaskService.createSubtask(subtaskInput);

    // Get task to find projectId for revalidation
    task = await SubtaskService.getSubtaskById(subtask.id).then((s) => s?.task);
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create subtask",
      message: null,
    };
  }

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
  let subtask;
  let task;

  try {
    subtask = await SubtaskService.createSubtask(data);

    // Get task to find projectId for revalidation
    task = await SubtaskService.getSubtaskById(subtask.id).then((s) => s?.task);
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create subtask",
      message: null,
    };
  }

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
      error:
        error instanceof Error ? error.message : "Failed to update subtask",
      message: null,
    };
  }
}

export async function deleteSubtask(
  id: string,
): Promise<{ error: string | null }> {
  let projectId: string;
  let taskId: string;

  try {
    const subtask = await SubtaskService.getSubtaskById(id);
    if (!subtask) {
      return {
        error: "Subtask not found",
      };
    }

    projectId = subtask.task.projectId;
    taskId = subtask.task.id;
    await SubtaskService.deleteSubtask(id);
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to delete subtask",
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { error: null };
}

export async function reorderSubtasks(
  taskId: string,
  subtaskIds: string[],
): Promise<{ error: string | null }> {
  let projectId: string | undefined;

  try {
    await SubtaskService.reorderSubtasks(taskId, subtaskIds);

    // Get task to find projectId for revalidation
    const subtask = await SubtaskService.getSubtasksByTaskId(taskId).then(
      (s) => s[0],
    );
    if (subtask) {
      const fullSubtask = await SubtaskService.getSubtaskById(subtask.id);
      if (fullSubtask?.task) {
        projectId = fullSubtask.task.projectId;
      }
    }
  } catch (error) {
    console.error("Failed to reorder subtasks:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to reorder subtasks",
    };
  }

  if (projectId) {
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  }

  return { error: null };
}
