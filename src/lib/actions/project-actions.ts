"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectService } from "@/lib/services/project-service";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations/project-schema";

export type ProjectFormState = {
  error: string | null;
  message: string | null;
} | null;

export async function createProjectAction(
  state: ProjectFormState,
  data: CreateProjectInput
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
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  state: ProjectFormState,
  data: UpdateProjectInput & { id: string }
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
  redirect("/projects");
}
