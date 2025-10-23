"use server";

import { revalidatePath } from "next/cache";
import { typedRedirect, routes } from '@/lib/routes';
import { ProjectService } from "@/lib/services/project-service";
import { Prisma } from "@prisma/client";

export type ProjectFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createProjectAction(
  state: ProjectFormState,
  data: Prisma.ProjectCreateInput
): Promise<ProjectFormState> {
  let project;

  try {
    project = await ProjectService.createProject(data);
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create project",
      message: null,
    };
  }

  revalidatePath("/projects");
  typedRedirect(routes.projects.detail, { projectId: project.id });
}

export async function updateProjectAction(
  state: ProjectFormState,
  data: Prisma.ProjectUpdateInput & { id: string }
): Promise<ProjectFormState> {
  try {
    const { id, ...updateData } = data;
    await ProjectService.updateProject(id, updateData);

    revalidatePath(`/projects/${id}`);
    revalidatePath("/projects");

    return {
      error: null,
      message: "Project updated successfully",
    };
  } catch (error) {
    console.error("Failed to update project:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to update project",
      message: null,
    };
  }
}

export async function deleteProject(id: string): Promise<{ error: string | null }> {
  try {
    await ProjectService.deleteProject(id);
  } catch (error) {
    console.error("Failed to delete project:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }

  revalidatePath("/projects");
  typedRedirect(routes.projects.list);
}
