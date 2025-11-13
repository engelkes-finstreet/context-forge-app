"use server";

import { FormState } from "@/components/forms/types";
import { ProjectService } from "@/lib/services/project-service";
import { revalidatePath } from "next/cache";
import { typedRedirect } from "@/lib/routes";
import { routes } from "@/lib/routes";
import {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/features/projects/components/forms/project/project-form-schema";

export async function createProjectFormAction(
  state: FormState,
  formData: CreateProjectInput,
): Promise<FormState> {
  const result = await ProjectService.createProject(formData);

  if (!result.success) {
    console.error("Failed to create project:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath("/projects");
  typedRedirect(routes.projects.detail, { projectId: result.data.id });
}

export async function editProjectFormAction(
  state: FormState,
  formData: UpdateProjectInput,
): Promise<FormState> {
  const { projectId, ...updateData } = formData;
  const result = await ProjectService.updateProject(projectId, updateData);

  if (!result.success) {
    console.error("Failed to update project:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");

  typedRedirect(routes.projects.detail, { projectId });
}
