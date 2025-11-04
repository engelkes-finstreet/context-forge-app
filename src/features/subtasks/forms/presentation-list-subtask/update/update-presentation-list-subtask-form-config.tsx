import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updatePresentationListSubtaskFormAction } from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-action";
import {
  UpdatePresentationListSubtaskFormInput,
  updatePresentationListSubtaskFormSchema,
  Column,
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

  const metadata = subtask.metadata
    ? JSON.parse(subtask.metadata as string)
    : null;

  const defaultValues: DeepPartial<UpdatePresentationListSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    columns: metadata?.columns
      ? metadata.columns.map((column: Column) => ({
          name: column.name,
          translation: column.translation,
          gridTemplateColumns: column.gridTemplateColumns,
        }))
      : [],
    noItemTranslation: metadata?.noItemTranslation || "",
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
