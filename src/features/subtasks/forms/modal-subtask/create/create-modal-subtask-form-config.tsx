import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createModalSubtaskFormAction } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-action";
import {
  CreateModalSubtaskFormInput,
  createModalSubtaskFormSchema,
} from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";
import { useCreateModalSubtaskFormFields } from "@/features/subtasks/forms/modal-subtask/use-modal-subtask-form-fields";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreateModalSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreateModalSubtaskFormInput> {
  const fields = useCreateModalSubtaskFormFields();
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );

  const defaultValues: DeepPartial<CreateModalSubtaskFormInput> = {
    taskId,
    modalName: "",
    metadata: {
      dataTypes: [
        {
          keyName: "",
          dataType: "",
        },
      ],
      withOpenButton: false,
      contentDescription: "",
    },
  };

  return {
    fields,
    defaultValues,
    schema: createModalSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createModalSubtaskFormAction,
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
