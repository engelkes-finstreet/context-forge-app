"use server";

import { FormState } from "@/components/forms/types";
import { EditTemplateInput } from "@/features/templates/components/forms/edit-template/edit-template-form-schema";
import { typedRedirect, routes } from "@/lib/routes";
import { TemplateService } from "@/lib/services/template-service";
import { revalidatePath } from "next/cache";

export async function editTemplateFormAction(
  state: FormState,
  formData: EditTemplateInput
): Promise<FormState> {
  const { id, ...updateData } = formData;
  const result = await TemplateService.update(id, updateData);

  if (!result.success) {
    console.error("Failed to update template:", result.errorMessage);
    return {
      error: result.errorMessage,
      message: null,
    };
  }

  revalidatePath("/templates");
  revalidatePath(`/templates/${id}`);
  typedRedirect(routes.templates.detail, {
    templateId: id,
  });
}
