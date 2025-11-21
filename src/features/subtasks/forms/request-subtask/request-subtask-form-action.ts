"use server";

import {
  CreateRequestSubtaskFormInput,
  RequestDatabaseMetadata,
  Requests,
  UpdateRequestSubtaskFormInput,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";
import { SubtaskService } from "@/lib/services/subtask-service";
import { SubtaskType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { typedRedirect } from "@/lib/routes";
import { routes } from "@/lib/routes";
import { TaskService } from "@/lib/services/task-service";
import { FormState } from "@/components/forms/types";

function getMetadata(requests: Requests): RequestDatabaseMetadata {
  const requestsMetadata = requests.map((request) => {
    // Parse endpoint format: "GET:/api/internal/financing_inquiries/hoa_account/{id}"
    const [httpMethod, endpoint] = request.endpoint.split(":", 2);

    return {
      endpoint: endpoint || request.endpoint, // Fallback to original if no colon found
      httpMethod: httpMethod || "GET", // Default to GET if parsing fails
      requestType: request.requestType,
      paginated: request.paginated,
      protected: request.protected,
      resultSchema: httpMethod === "GET" ? true : request.resultSchema,
    };
  });

  return {
    requests: requestsMetadata,
  };
}

export async function createRequestSubtaskFormAction(
  state: FormState,
  formData: CreateRequestSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);

  const metadata = getMetadata(formData.metadata.requests);

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.subtaskName,
    type: SubtaskType.REQUEST,
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

export async function updateRequestSubtaskFormAction(
  state: FormState,
  formData: UpdateRequestSubtaskFormInput,
): Promise<FormState> {
  const subtask = await SubtaskService.getSubtaskById(formData.subtaskId);

  const metadata = getMetadata(formData.metadata.requests);

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
