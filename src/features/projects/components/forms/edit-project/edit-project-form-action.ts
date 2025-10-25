"use server";

import { FormState } from "@/components/forms/types";
import { UpdateProjectInput } from "@/features/projects/components/forms/edit-project/edit-project-form-schema";
import { routes, typedRedirect } from "@/lib/routes";
import { ProjectService } from "@/lib/services/project-service";
import { revalidatePath } from "next/cache";

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
