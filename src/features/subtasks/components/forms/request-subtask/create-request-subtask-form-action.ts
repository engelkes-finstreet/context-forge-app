"use server";

import { CreateRequestSubtaskFormInput } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-schema";
import { SubtaskFormState } from "@/lib/actions/subtask-actions";
import { SubtaskService } from "@/lib/services/subtask-service";
import { Prisma, SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { typedRedirect } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";

export async function createRequestSubtaskFormAction(
  state: SubtaskFormState,
  formData: CreateRequestSubtaskFormInput,
): Promise<SubtaskFormState> {
  const task = await TaskService.getTaskById(formData.taskId);
  const maxOrderSubtask = task.subtasks.reduce(
    (max, subtask) => Math.max(max, subtask.order),
    0,
  );

  const subtaskInput: Prisma.SubtaskUncheckedCreateInput = {
    name: formData.name,
    taskId: formData.taskId,
    order: maxOrderSubtask + 1,
    type: SubtaskType.REQUEST,
    metadata: JSON.stringify(formData.requests),
    content: "",
  };

  await SubtaskService.createSubtask(subtaskInput);

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
