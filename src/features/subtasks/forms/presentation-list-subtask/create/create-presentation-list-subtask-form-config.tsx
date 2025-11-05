"use client";

import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createPresentationListSubtaskFormAction } from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-action";
import {
  CreatePresentationListSubtaskFormInput,
  createPresentationListSubtaskFormSchema,
} from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-schema";
import { useCreatePresentationListSubtaskFormFields } from "@/features/subtasks/forms/presentation-list-subtask/use-presentation-list-subtask-form-fields";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreatePresentationListSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreatePresentationListSubtaskFormInput> {
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );
  const fields = useCreatePresentationListSubtaskFormFields();

  const defaultValues: DeepPartial<CreatePresentationListSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    metadata: {
      columns: [
        {
          name: "",
          translation: "",
          gridTemplateColumns: undefined,
        },
      ],
      noItemTranslation: "",
    },
  };

  return {
    fields,
    defaultValues,
    schema: createPresentationListSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createPresentationListSubtaskFormAction,
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
