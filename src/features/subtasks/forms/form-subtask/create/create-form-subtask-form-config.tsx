"use client";

import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createFormSubtaskFormAction } from "@/features/subtasks/forms/form-subtask/form-subtask-form-action";
import {
  createFormSubtaskFormSchema,
  CreateFormSubtaskFormInput,
} from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";
import { useCreateFormSubtaskFormFields } from "@/features/subtasks/forms/form-subtask/use-form-subtask-form-fields";
import { useRouter } from "next/navigation";

export function useCreateFormSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreateFormSubtaskFormInput> {
  const router = useRouter();
  const fields = useCreateFormSubtaskFormFields();

  const defaultValues = {
    taskId,
    subtaskName: "",
    metadata: {
      additionalDetails: "",
      fields: [
        {
          fieldType: "input",
          name: "",
          label: "",
          description: "",
          options: [
            {
              name: "",
              label: "",
              sublabel: "",
            },
          ],
          variant: "default",
          selectItems: [
            {
              label: "",
              value: "",
            },
          ],
          multiSelect: false,
          inputType: "text",
          placeholder: "",
          validation: "",
          suffix: "none",
        },
      ],
    },
  };

  return {
    fields,
    defaultValues: defaultValues as any,
    schema: createFormSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createFormSubtaskFormAction,
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
            {isPending ? "Creating..." : "Create Subtask"}
          </Button>
        </div>
      );
    },
    mode: "onSubmit",
  };
}
