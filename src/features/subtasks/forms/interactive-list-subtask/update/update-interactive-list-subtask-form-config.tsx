import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updatePresentationListSubtaskFormAction } from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-action";
import {
  UpdateInteractiveListSubtaskFormInput,
  updateInteractiveListSubtaskFormSchema,
  InteractiveListMetadata,
} from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-schema";
import { useUpdateInteractiveListSubtaskFormFields } from "@/features/subtasks/forms/interactive-list-subtask/use-interactive-list-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

export function useUpdateInteractiveListSubtaskFormConfig(
  subtask: Subtask,
): FormConfig<FormState, UpdateInteractiveListSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdateInteractiveListSubtaskFormFields();

  const defaultValues: DeepPartial<UpdateInteractiveListSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    metadata: subtask.metadata as InteractiveListMetadata,
  };

  return {
    fields,
    defaultValues,
    schema: updateInteractiveListSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updatePresentationListSubtaskFormAction,
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
