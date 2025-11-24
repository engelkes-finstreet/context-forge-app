"use server";

import { FormState } from "@/components/forms/types";
import {
  CreateSimpleFormSubtaskFormInput,
  UpdateSimpleFormSubtaskFormInput,
} from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createSimpleFormSubtaskFormAction(
  state: FormState,
  formData: CreateSimpleFormSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.metadata.simpleFormName,
    type: SubtaskType.SIMPLE_FORM,
    content: formData.metadata.description,
    metadata: formData.metadata,
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

export async function updateSimpleFormSubtaskFormAction(
  state: FormState,
  formData: UpdateSimpleFormSubtaskFormInput,
): Promise<FormState> {
  const subtask = await SubtaskService.getSubtaskById(formData.subtaskId);

  const result = await SubtaskService.updateSubtask(formData.subtaskId, {
    name: formData.metadata.simpleFormName,
    content: formData.metadata.description,
    metadata: formData.metadata,
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
