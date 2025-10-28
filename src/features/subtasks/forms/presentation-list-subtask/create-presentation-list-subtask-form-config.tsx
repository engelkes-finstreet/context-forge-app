import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createPresentationListSubtaskFormAction } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-action";
import {
  CreatePresentationListSubtaskFormInput,
  createPresentationListSubtaskFormSchema,
} from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-schema";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

type Props = {
  taskId: string;
};

export function useCreatePresentationListSubtaskFormConfig({
  taskId,
}: Props): FormConfig<FormState, CreatePresentationListSubtaskFormInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreatePresentationListSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    columns: [
      {
        name: "",
        translation: "",
        gridTemplateColumns: undefined,
      },
    ],
    noItemTranslation: "",
  };

  const fields: FormFieldsType<CreatePresentationListSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    columns: {
      type: "array",
      name: {
        type: "input",
        label: "Name",
        placeholder: "Enter name",
      },
      translation: {
        type: "input",
        label: "Translation",
        placeholder: "Enter translation",
      },
      gridTemplateColumns: {
        type: "input",
        label: "Grid Template Columns",
        placeholder: "Enter grid template columns",
        inputType: "number",
      },
    },
    noItemTranslation: {
      type: "input",
      label: "No Item Translation",
      placeholder: "Enter no item translation",
    },
  };

  return {
    fields,
    defaultValues,
    schema: createPresentationListSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createPresentationListSubtaskFormAction,
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
  };
}
