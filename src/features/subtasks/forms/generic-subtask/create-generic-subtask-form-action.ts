"use server";

import { FormState } from "@/components/forms/types";
import { CreateGenericSubtaskFormInput } from "@/features/subtasks/forms/generic-subtask/create-generic-subtask-form-schema";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { typedRedirect, routes } from "@/lib/routes";

export async function createGenericSubtaskFormAction(
  state: FormState,
  formData: CreateGenericSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const result = await SubtaskService.updateSubtask(formData.subtaskId, {
    type: SubtaskType.GENERIC,
    content: formData.content,
    metadata: null,
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
