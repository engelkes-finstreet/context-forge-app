import { FormFieldsType } from "@/components/forms/types";
import {
  CreateInteractiveListSubtaskFormInput,
  UpdateInteractiveListSubtaskFormInput,
} from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-schema";

export function useCreateInteractiveListSubtaskFormFields(): FormFieldsType<CreateInteractiveListSubtaskFormInput> {
  return {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    metadata: {
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
    },
  };
}

export function useUpdateInteractiveListSubtaskFormFields(): FormFieldsType<UpdateInteractiveListSubtaskFormInput> {
  const fields = useCreateInteractiveListSubtaskFormFields();
  return {
    ...fields,
    subtaskId: {
      type: "hidden",
    },
  };
}
