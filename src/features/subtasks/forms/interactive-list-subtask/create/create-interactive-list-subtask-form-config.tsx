"use client";

import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createInteractiveListSubtaskFormAction } from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-action";
import {
  CreateInteractiveListSubtaskFormInput,
  createInteractiveListSubtaskFormSchema,
} from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-schema";
import { useCreateInteractiveListSubtaskFormFields } from "@/features/subtasks/forms/interactive-list-subtask/use-interactive-list-subtask-form-fields";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreateInteractiveListSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreateInteractiveListSubtaskFormInput> {
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );
  const fields = useCreateInteractiveListSubtaskFormFields();

  const defaultValues: DeepPartial<CreateInteractiveListSubtaskFormInput> = {
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
    schema: createInteractiveListSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createInteractiveListSubtaskFormAction,
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
