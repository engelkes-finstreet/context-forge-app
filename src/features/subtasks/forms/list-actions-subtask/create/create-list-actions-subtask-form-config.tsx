import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createListActionsSubtaskFormAction } from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-action";
import {
  CreateListActionsSubtaskFormInput,
  listActionsSubtaskFormSchema,
} from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-schema";
import {
  CreateListActionsSubtaskFormFieldsProps,
  useCreateListActionsSubtaskFormFields,
} from "@/features/subtasks/forms/list-actions-subtask/use-list-actions-subtask-form-fields";
import { useSelectedTypeStore } from "@/features/subtasks/stores/selected-type-store";
import { DeepPartial } from "react-hook-form";

export function useCreateListActionsSubtaskFormConfig({
  taskId,
  swaggerPathOptions,
  nameOptions,
}: { taskId: string } & CreateListActionsSubtaskFormFieldsProps): FormConfig<
  FormState,
  CreateListActionsSubtaskFormInput
> {
  const clearSelectedType = useSelectedTypeStore(
    (state) => state.clearSelectedType,
  );

  const fields = useCreateListActionsSubtaskFormFields({
    swaggerPathOptions,
    nameOptions,
  });

  const defaultValues: DeepPartial<CreateListActionsSubtaskFormInput> = {
    taskId,
    listActionsName: "",
    metadata: {
      pagePath: "",
      withSearch: false,
      withSort: false,
      withGrouping: false,
      interactiveLists: [
        {
          swaggerPath: "",
          name: "",
        },
      ],
    },
  };

  return {
    fields,
    defaultValues,
    schema: listActionsSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createListActionsSubtaskFormAction,
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
