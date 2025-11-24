"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createPageSubtaskFormAction } from "@/features/subtasks/forms/page-subtask/page-subtask-form-action";
import {
  CreatePageSubtaskFormInput,
  createPageSubtaskFormSchema,
} from "@/features/subtasks/forms/page-subtask/page-subtask-form-schema";
import { useCreatePageSubtaskFormFields } from "@/features/subtasks/forms/page-subtask/use-page-subtask-form-fields";
import { PageType } from "@/features/subtasks/forms/page-subtask/use-page-type-options";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreatePageSubtaskFormConfig({
  taskId,
}: {
  taskId: string;
}): FormConfig<FormState, CreatePageSubtaskFormInput> {
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );

  const fields = useCreatePageSubtaskFormFields();

  const defaultValues: DeepPartial<CreatePageSubtaskFormInput> = {
    taskId,
    pageName: "",
    metadata: {
      pageType: PageType.INQUIRY,
      translations: {
        title: "",
        description: "",
      },
    },
  };

  return {
    fields,
    defaultValues,
    schema: createPageSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createPageSubtaskFormAction,
    renderFormActions: (isPending: boolean) => {
      return (
        <div className="flex gap-4 w-full justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => clearSelectedType()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Subtask"}
          </Button>
        </div>
      );
    },
  };
}
