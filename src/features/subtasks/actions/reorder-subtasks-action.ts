"use server";

import { SubtaskService } from "@/lib/services/subtask-service";
import { revalidatePath } from "next/cache";

export async function reorderSubtasksAction(
  taskId: string,
  projectId: string,
  subtaskIds: string[],
): Promise<{ error: string | null }> {
  const result = await SubtaskService.reorderSubtasks(taskId, subtaskIds);

  if (!result.success) {
    console.error("Failed to reorder subtasks:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { error: null };
}
