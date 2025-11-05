import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updatePresentationListSubtaskFormAction } from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-action";
import {
  UpdatePresentationListSubtaskFormInput,
  updatePresentationListSubtaskFormSchema,
  PresentationListMetadata,
} from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-schema";
import { useUpdatePresentationListSubtaskFormFields } from "@/features/subtasks/forms/presentation-list-subtask/use-presentation-list-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

export function useUpdatePresentationListSubtaskFormConfig(
  subtask: Subtask,
): FormConfig<FormState, UpdatePresentationListSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdatePresentationListSubtaskFormFields();

  const defaultValues: DeepPartial<UpdatePresentationListSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    metadata: subtask.metadata as PresentationListMetadata,
  };

  return {
    fields,
    defaultValues,
    schema: updatePresentationListSubtaskFormSchema,
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
