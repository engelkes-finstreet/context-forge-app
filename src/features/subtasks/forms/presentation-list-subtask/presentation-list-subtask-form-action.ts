"use server";

import { FormState } from "@/components/forms/types";
import {
  CreatePresentationListSubtaskFormInput,
  UpdatePresentationListSubtaskFormInput,
  Columns,
} from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

function getMetadata(columns: Columns, noItemTranslation: string) {
  return {
    columns,
    noItemTranslation,
  };
}

export async function createPresentationListSubtaskFormAction(
  state: FormState,
  formData: CreatePresentationListSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = getMetadata(formData.columns, formData.noItemTranslation);

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.PRESENTATION_LIST,
    content: "",
    metadata: metadata,
  });

  if (result.success) {
    revalidatePath(`/projects/${task.projectId}/tasks/${task.id}`);
    typedRedirect(routes.projects.tasks.detail, {
      projectId: task.projectId,
      taskId: task.id,
    });
  } else {
    return {
      error: result.errorMessage,
      message: null,
    };
  }
}

export async function updatePresentationListSubtaskFormAction(
  state: FormState,
  formData: UpdatePresentationListSubtaskFormInput,
): Promise<FormState> {
  const subtask = await SubtaskService.getSubtaskById(formData.subtaskId);

  const metadata = getMetadata(formData.columns, formData.noItemTranslation);

  const result = await SubtaskService.updateSubtask(formData.subtaskId, {
    metadata: metadata,
  });

  if (result.success) {
    revalidatePath(
      `/projects/${subtask.task.projectId}/tasks/${subtask.task.id}`,
    );
    typedRedirect(routes.projects.tasks.detail, {
      projectId: subtask.task.projectId,
      taskId: subtask.task.id,
    });
  } else {
    return {
      error: result.errorMessage,
      message: null,
    };
  }
}
