"use server";

import { NewSubtaskFormInput } from "@/features/subtasks/forms/new-subtask/new-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { FormState } from "@/components/forms/types";

export async function newSubtaskFormAction(
  state: FormState,
  formData: NewSubtaskFormInput,
): Promise<FormState> {
  const { featureName, product, role, subtaskType, taskId } = formData;

  const task = await TaskService.getTaskById(taskId);
  const maxOrderSubtask = task.subtasks.reduce(
    (max, subtask) => Math.max(max, subtask.order),
    0,
  );

  const subtask = await SubtaskService.createSubtask({
    taskId,
    featureName,
    product,
    role,
    content: "",
    order: maxOrderSubtask + 1,
    type: subtaskType as SubtaskType,
    metadata: {},
  });

  if (!subtask.success) {
    return {
      error: subtask.errorMessage,
      message: null,
    };
  }

  typedRedirect(routes.projects.tasks.subtasks.newRequest, {
    projectId: task.projectId,
    taskId: task.id,
    subtaskId: subtask.data.id,
  });
}
