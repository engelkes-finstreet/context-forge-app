import { FormState } from "@/components/forms/types";

import { FormConfig } from "@/components/forms/types";
import {
  CreateListActionsSubtaskFormFieldsProps,
  useUpdateListActionsSubtaskFormFields,
} from "@/features/subtasks/forms/list-actions-subtask/use-list-actions-subtask-form-fields";
import {
  ListActionsSubtaskMetadata,
  UpdateListActionsSubtaskFormInput,
  updateListActionsSubtaskFormSchema,
} from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-schema";
import { Subtask } from "@prisma/client";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateListActionsSubtaskFormAction } from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-action";
import { Button } from "@/components/ui/button";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";

export function useUpdateListActionsSubtaskFormConfig({
  subtask,
  swaggerPathOptions,
  nameOptions,
}: { subtask: Subtask } & CreateListActionsSubtaskFormFieldsProps): FormConfig<
  FormState,
  UpdateListActionsSubtaskFormInput
> {
  const router = useRouter();
  const fields = useUpdateListActionsSubtaskFormFields({
    swaggerPathOptions,
    nameOptions,
  });
  const defaultValues: DeepPartial<UpdateListActionsSubtaskFormInput> = {
    subtaskId: subtask.id,
    listActionsName: subtask.name,
    taskId: subtask.taskId,
    metadata: subtask.metadata as ListActionsSubtaskMetadata,
  };
  return {
    fields,
    defaultValues,
    schema: updateListActionsSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateListActionsSubtaskFormAction,
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
