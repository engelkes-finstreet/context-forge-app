"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createSimpleFormSubtaskFormAction } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-action";
import {
  CreateSimpleFormSubtaskFormInput,
  createSimpleFormSubtaskFormSchema,
} from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";
import {
  CreateSimpleFormSubtaskFormFieldsProps,
  useCreateSimpleFormSubtaskFormFields,
} from "@/features/subtasks/forms/simple-form-subtask/use-simple-form-subtask-form-fields";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreateSimpleFormSubtaskFormConfig({
  taskId,
  swaggerPathOptions,
}: { taskId: string } & CreateSimpleFormSubtaskFormFieldsProps): FormConfig<
  FormState,
  CreateSimpleFormSubtaskFormInput
> {
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );

  const fields = useCreateSimpleFormSubtaskFormFields({
    swaggerPathOptions,
  });

  const defaultValues: DeepPartial<CreateSimpleFormSubtaskFormInput> = {
    taskId,
    metadata: {
      simpleFormName: "",
      swaggerPath: "",
      description: "",
    },
  };

  return {
    fields,
    defaultValues,
    schema: createSimpleFormSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createSimpleFormSubtaskFormAction,
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
