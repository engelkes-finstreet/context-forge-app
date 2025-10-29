"use server";

import { FormState } from "@/components/forms/types";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createFormSubtaskFormAction(
  state: FormState,
  formData: CreateFormSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = {
    fields: formData.fields,
  };

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.FORM,
    content: "",
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
