"use server";

import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";

export async function deleteSubtaskAction(
  subtaskId: string,
  projectId: string,
  taskId: string,
): Promise<{ error: string | null }> {
  const result = await SubtaskService.deleteSubtask(subtaskId);

  if (!result.success) {
    console.error("Failed to delete subtask:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  typedRedirect(routes.projects.tasks.detail, { projectId, taskId });
}
