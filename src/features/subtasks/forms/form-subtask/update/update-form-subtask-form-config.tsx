import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updateFormSubtaskFormAction } from "@/features/subtasks/forms/form-subtask/form-subtask-form-action";
import {
  UpdateFormSubtaskFormInput,
  updateFormSubtaskFormSchema,
  FormFieldConfig,
  FormSubtaskMetadata,
} from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";
import { useUpdateFormSubtaskFormFields } from "@/features/subtasks/forms/form-subtask/use-form-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

export function useUpdateFormSubtaskFormConfig(
  subtask: Subtask,
): FormConfig<FormState, UpdateFormSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdateFormSubtaskFormFields();

  const metadata = subtask.metadata as { fields?: FormFieldConfig[] } | null;

  const defaultValues: DeepPartial<UpdateFormSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    metadata: subtask.metadata as FormSubtaskMetadata,
  };

  return {
    fields,
    defaultValues: defaultValues as any,
    schema: updateFormSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateFormSubtaskFormAction,
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
    mode: "onSubmit",
  };
}
