"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updateSimpleFormSubtaskFormAction } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-action";
import {
  UpdateSimpleFormSubtaskFormInput,
  updateSimpleFormSubtaskFormSchema,
  SimpleFormSubtaskMetadata,
} from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";
import {
  CreateSimpleFormSubtaskFormFieldsProps,
  useUpdateSimpleFormSubtaskFormFields,
} from "@/features/subtasks/forms/simple-form-subtask/use-simple-form-subtask-form-fields";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";

export function useUpdateSimpleFormSubtaskFormConfig({
  subtaskId,
  taskId,
  swaggerPathOptions,
  metadata,
}: {
  subtaskId: string;
  taskId: string;
  metadata: SimpleFormSubtaskMetadata;
} & CreateSimpleFormSubtaskFormFieldsProps): FormConfig<
  FormState,
  UpdateSimpleFormSubtaskFormInput
> {
  const router = useRouter();

  const fields = useUpdateSimpleFormSubtaskFormFields({
    swaggerPathOptions,
  });

  const defaultValues: DeepPartial<UpdateSimpleFormSubtaskFormInput> = {
    subtaskId,
    taskId,
    metadata: {
      simpleFormName: metadata.simpleFormName,
      swaggerPath: metadata.swaggerPath,
      description: metadata.description,
    },
  };

  return {
    fields,
    defaultValues,
    schema: updateSimpleFormSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateSimpleFormSubtaskFormAction,
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
