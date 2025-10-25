"use server";

import { CreateProjectInput } from "@/features/projects/components/forms/create-project/create-project-form-schema";
import { FormState } from "@/components/forms/types";
import { ProjectService } from "@/lib/services/project-service";
import { revalidatePath } from "next/cache";
import { typedRedirect } from "@/lib/routes";
import { routes } from "@/lib/routes";

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
