import { FormFieldsType } from "@/components/forms/types";
import {
  CreateModalSubtaskFormInput,
  UpdateModalSubtaskFormInput,
} from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-schema";

export function useCreateModalSubtaskFormFields(): FormFieldsType<CreateModalSubtaskFormInput> {
  return {
    modalName: {
      type: "input",
      label: "Modal Name",
      placeholder: "Enter modal name",
    },
    metadata: {
      dataTypes: {
        type: "array",
        keyName: {
          type: "input",
          label: "Key Name",
          placeholder: "Enter key name",
        },
        dataType: {
          type: "select",
          label: "Data Type",
          placeholder: "Select data type",
          options: [
            {
              label: "String",
              value: "string",
            },
            {
              label: "Number",
              value: "number",
            },
            {
              label: "Boolean",
              value: "boolean",
            },
          ],
        },
      },
      translations: {
        title: {
          type: "input",
          label: "Title",
          placeholder: "Enter title",
        },
        subheading: {
          type: "input",
          label: "Subheading (optional)",
          placeholder: "Enter subheading",
        },
        confirmButton: {
          type: "input",
          label: "Confirm Button (optional)",
          placeholder: "Enter confirm button",
          tooltip:
            "Some modals will not include a form that handles the action buttons but they will have to handle it on their own. \n This is the text for the button that will be used to confirm the action.",
        },
      },
      withOpenButton: {
        type: "checkbox",
        label: "With Open Button",
      },
      contentDescription: {
        type: "textarea",
        label: "Content Description",
        placeholder: "Enter content description",
      },
    },
    taskId: {
      type: "hidden",
    },
  };
}

export function useUpdateModalSubtaskFormFields(): FormFieldsType<UpdateModalSubtaskFormInput> {
  return {
    ...useCreateModalSubtaskFormFields(),
    subtaskId: {
      type: "hidden",
    },
  };
}
