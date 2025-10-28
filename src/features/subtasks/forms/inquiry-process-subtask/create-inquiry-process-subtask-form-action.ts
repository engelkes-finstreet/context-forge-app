"use server";

import { FormState } from "@/components/forms/types";
import { CreateInquiryProcessSubtaskFormInput } from "@/features/subtasks/forms/inquiry-process-subtask/create-inquiry-process-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createInquiryProcessSubtaskFormAction(
  state: FormState,
  formData: CreateInquiryProcessSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = {
    inquiryRoute: formData.inquiryRoute,
    steps: formData.steps,
    progressBar: formData.progressBar,
  };

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.INQUIRY_PROCESS,
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
