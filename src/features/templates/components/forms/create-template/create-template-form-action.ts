"use server";

import { FormState } from "@/components/forms/types";
import { CreateTemplateInput } from "@/features/templates/components/forms/create-template/create-template-form-schema";
import { typedRedirect, routes } from "@/lib/routes";
import { TemplateService } from "@/lib/services/template-service";
import { revalidatePath } from "next/cache";

export async function createTemplateFormAction(
  state: FormState,
  formData: CreateTemplateInput
): Promise<FormState> {
  const result = await TemplateService.create(formData);

  if (!result.success) {
    console.error("Failed to create template:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath("/templates");
  typedRedirect(routes.templates.detail, {
    templateId: result.data.id,
  });
}
