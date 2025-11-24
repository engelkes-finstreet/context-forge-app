"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updatePageSubtaskFormAction } from "@/features/subtasks/forms/page-subtask/page-subtask-form-action";
import {
  UpdatePageSubtaskFormInput,
  updatePageSubtaskFormSchema,
  PageSubtaskMetadata,
} from "@/features/subtasks/forms/page-subtask/page-subtask-form-schema";
import { useUpdatePageSubtaskFormFields } from "@/features/subtasks/forms/page-subtask/use-page-subtask-form-fields";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";

export function useUpdatePageSubtaskFormConfig({
  subtaskId,
  taskId,
  pageName,
  metadata,
}: {
  subtaskId: string;
  taskId: string;
  pageName: string;
  metadata: PageSubtaskMetadata;
}): FormConfig<FormState, UpdatePageSubtaskFormInput> {
  const router = useRouter();

  const fields = useUpdatePageSubtaskFormFields();

  const defaultValues: DeepPartial<UpdatePageSubtaskFormInput> = {
    subtaskId,
    taskId,
    pageName,
    metadata: {
      pageType: metadata.pageType,
      translations: {
        title: metadata.translations.title,
        description: metadata.translations.description ?? "",
      },
    },
  };

  return {
    fields,
    defaultValues,
    schema: updatePageSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updatePageSubtaskFormAction,
    renderFormActions: (isPending: boolean) => {
      return (
        <div className="flex gap-4 w-full justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Subtask"}
          </Button>
        </div>
      );
    },
  };
}
