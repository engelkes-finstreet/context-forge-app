"use server";

import { revalidatePath } from "next/cache";
import { typedRedirect, routes } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { CreateProjectInput } from "@/features/projects/components/forms/create-project/create-project-form-schema";
import { UpdateProjectInput } from "@/features/projects/components/forms/edit-project/edit-project-form-schema";

export type ProjectFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createProjectAction(
  state: ProjectFormState,
  formData: CreateProjectInput,
): Promise<ProjectFormState> {
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

export async function updateProjectAction(
  state: ProjectFormState,
  formData: UpdateProjectInput & { id: string },
): Promise<ProjectFormState> {
  const { id, ...updateData } = formData;
  const result = await ProjectService.updateProject(id, updateData);

  if (!result.success) {
    console.error("Failed to update project:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");

  typedRedirect(routes.projects.detail, { projectId: result.data.id });
}

export async function deleteProject(
  id: string,
): Promise<{ error: string | null }> {
  const result = await ProjectService.deleteProject(id);

  if (!result.success) {
    console.error("Failed to delete project:", result.errorMessage);
    return {
      error: result.errorMessage,
    };
  }

  revalidatePath("/projects");
  typedRedirect(routes.projects.list);
}
