import { FormFieldsType } from "@/components/forms/types";
import {
  CreatePresentationListSubtaskFormInput,
  UpdatePresentationListSubtaskFormInput,
} from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-schema";

export function useCreatePresentationListSubtaskFormFields(): FormFieldsType<CreatePresentationListSubtaskFormInput> {
  return {
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
      },
    },
    noItemTranslation: {
      type: "input",
      label: "No Item Translation",
      placeholder: "Enter no item translation",
    },
  };
}

export function useUpdatePresentationListSubtaskFormFields(): FormFieldsType<UpdatePresentationListSubtaskFormInput> {
  const fields = useCreatePresentationListSubtaskFormFields();
  return {
    ...fields,
    subtaskId: {
      type: "hidden",
    },
  };
}
