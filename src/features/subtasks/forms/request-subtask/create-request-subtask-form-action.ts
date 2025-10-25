"use server";

import { CreateRequestSubtaskFormInput } from "@/features/subtasks/forms/request-subtask/create-request-subtask-form-schema";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { typedRedirect } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { FormState } from "@/components/forms/types";

export async function createRequestSubtaskFormAction(
  state: FormState,
  formData: CreateRequestSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const subtaskInput: Prisma.SubtaskUncheckedUpdateInput = {
    metadata: JSON.stringify(formData.requests),
  };

  await SubtaskService.updateSubtask(formData.subtaskId, subtaskInput);

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
