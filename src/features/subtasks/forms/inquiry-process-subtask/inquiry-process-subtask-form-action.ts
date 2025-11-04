"use server";

import { FormState } from "@/components/forms/types";
import {
  CreateInquiryProcessSubtaskFormInput,
  UpdateInquiryProcessSubtaskFormInput,
  Steps,
  ProgressBar,
} from "@/features/subtasks/forms/inquiry-process-subtask/inquiry-process-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

function getMetadata(
  inquiryRoute: string,
  steps: Steps,
  progressBar: ProgressBar,
) {
  return {
    inquiryRoute,
    steps,
    progressBar,
  };
}

export async function createInquiryProcessSubtaskFormAction(
  state: FormState,
  formData: CreateInquiryProcessSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = getMetadata(
    formData.inquiryRoute,
    formData.steps,
    formData.progressBar,
  );

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.INQUIRY_PROCESS,
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

export async function updateInquiryProcessSubtaskFormAction(
  state: FormState,
  formData: UpdateInquiryProcessSubtaskFormInput,
): Promise<FormState> {
  const subtask = await SubtaskService.getSubtaskById(formData.subtaskId);

  const metadata = getMetadata(
    formData.inquiryRoute,
    formData.steps,
    formData.progressBar,
  );

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
