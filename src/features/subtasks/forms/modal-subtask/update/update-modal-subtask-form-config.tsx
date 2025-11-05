import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updateModalSubtaskFormAction } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-action";
import {
  ModalSubtaskMetadata,
  UpdateModalSubtaskFormInput,
  updateModalSubtaskFormSchema,
} from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";
import { useUpdateModalSubtaskFormFields } from "@/features/subtasks/forms/modal-subtask/use-modal-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";

export function useUpdateModalSubtaskFormConfig(
  subtask: Subtask,
): FormConfig<FormState, UpdateModalSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdateModalSubtaskFormFields();
  const defaultValues: DeepPartial<UpdateModalSubtaskFormInput> = {
    subtaskId: subtask.id,
    modalName: subtask.name,
    taskId: subtask.taskId,
    metadata: subtask.metadata as ModalSubtaskMetadata,
  };

  return {
    fields,
    defaultValues: defaultValues,
    schema: updateModalSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateModalSubtaskFormAction,
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
