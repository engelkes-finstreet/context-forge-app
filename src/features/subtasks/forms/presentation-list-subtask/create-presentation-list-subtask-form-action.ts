"use server";

import { FormState } from "@/components/forms/types";
import { CreatePresentationListSubtaskFormInput } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPresentationListSubtaskFormAction(
  state: FormState,
  formData: CreatePresentationListSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = {
    columns: formData.columns,
    noItemTranslation: formData.noItemTranslation,
  };

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.PRESENTATION_LIST,
    content: JSON.stringify(metadata),
    metadata: JSON.stringify(metadata),
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
