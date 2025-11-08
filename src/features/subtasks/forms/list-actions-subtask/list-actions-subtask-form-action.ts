"use server";

import { FormState } from "@/components/forms/types";
import {
  CreateListActionsSubtaskFormInput,
  UpdateListActionsSubtaskFormInput,
  ListActionsSubtaskMetadata,
} from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { SubtaskService } from "@/lib/services/subtask-service";
import { TaskService } from "@/lib/services/task-service";
import { ProjectService } from "@/lib/services/project-service";
import { SwaggerService } from "@/lib/services/swagger-service";
import { SubtaskType, Project } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Generate subtask content from swagger endpoints based on metadata
 */
async function generateContentFromSwagger(
  project: Project,
  metadata: ListActionsSubtaskMetadata,
): Promise<string> {
  if (
    !project.githubRepo ||
    !project.swaggerPath ||
    metadata.interactiveLists.length === 0
  ) {
    return "";
  }

  try {
    const contentSections: string[] = [];

    // Iterate through each interactive list
    for (const interactiveList of metadata.interactiveLists) {
      // Fetch raw endpoint definitions
      const rawDefinitions = await SwaggerService.getRawEndpointDefinitions(
        project.githubRepo,
        project.swaggerPath,
        [interactiveList.swaggerPath],
      );

      // Format as YAML in markdown code blocks
      const formattedContent = SwaggerService.formatEndpointsAsYaml(
        rawDefinitions,
        interactiveList.name,
      );

      contentSections.push(formattedContent);
    }

    return contentSections.join("\n\n");
  } catch (error) {
    // If swagger fetch fails, log error but don't fail the whole operation
    console.error("Failed to fetch swagger endpoints:", error);
    return "# API Endpoints\n\nFailed to fetch endpoint details from Swagger specification.";
  }
}

export async function createListActionsSubtaskFormAction(
  state: FormState,
  formData: CreateListActionsSubtaskFormInput,
): Promise<FormState> {
  const task = await TaskService.getTaskById(formData.taskId);
  const project = await ProjectService.getProjectById(task.projectId);

  const content = await generateContentFromSwagger(project, formData.metadata);

  const result = await SubtaskService.createSubtask({
    taskId: formData.taskId,
    name: formData.listActionsName,
    type: SubtaskType.LIST_ACTIONS_AND_PAGINATION,
    content: content,
    metadata: formData.metadata,
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

export async function updateListActionsSubtaskFormAction(
  state: FormState,
  formData: UpdateListActionsSubtaskFormInput,
): Promise<FormState> {
  const subtask = await SubtaskService.getSubtaskById(formData.subtaskId);
  const project = await ProjectService.getProjectById(subtask.task.projectId);

  const content = await generateContentFromSwagger(project, formData.metadata);

  const result = await SubtaskService.updateSubtask(formData.subtaskId, {
    metadata: formData.metadata,
    content: content,
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
