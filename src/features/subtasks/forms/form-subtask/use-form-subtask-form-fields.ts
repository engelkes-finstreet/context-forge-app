import { FormFieldsType } from "@/components/forms/types";
import {
  CreateFormSubtaskFormInput,
  UpdateFormSubtaskFormInput,
} from "@/features/subtasks/forms/form-subtask/form-subtask-form-schema";

export function useCreateFormSubtaskFormFields(): FormFieldsType<CreateFormSubtaskFormInput> {
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
      fields: {
        type: "array",
        fieldType: {
          type: "select",
          label: "Field Type",
          placeholder: "Select field type",
          options: [
            { label: "Input", value: "input" },
            { label: "Password", value: "password" },
            { label: "Textarea", value: "textarea" },
            { label: "Number", value: "number" },
            { label: "Date", value: "datepicker" },
            { label: "Checkbox", value: "checkbox" },
            { label: "Radio Group", value: "radio-group" },
            { label: "Yes No Radio", value: "yes-no-radio" },
            { label: "Select", value: "select" },
            { label: "Combobox", value: "combobox" },
            { label: "Selectable Card", value: "selectable-card" },
            { label: "Hidden", value: "hidden" },
          ],
        },
        name: {
          type: "input",
          label: "Name",
          placeholder: "Enter name",
        },
        label: {
          type: "input",
          label: "Label",
          placeholder: "Enter label",
        },
        description: {
          type: "input",
          label: "Description",
          placeholder: "Enter description",
        },
        validation: {
          type: "input",
          label: "Validation",
          placeholder: "Enter validation",
        },
        placeholder: {
          type: "input",
          label: "Placeholder",
          placeholder: "Enter placeholder",
        },
        multiSelect: {
          type: "checkbox",
          label: "Multi Select",
        },
        options: {
          type: "array",
          name: {
            type: "input",
            label: "Name",
            placeholder: "Enter name",
          },
          label: {
            type: "input",
            label: "Label",
            placeholder: "Enter label",
          },
          sublabel: {
            type: "input",
            label: "Sublabel",
            placeholder: "Enter sublabel",
          },
        },
        radioItems: {
          type: "array",
          label: {
            type: "input",
            label: "Label",
            placeholder: "Enter label",
          },
          value: {
            type: "input",
            label: "Value",
            placeholder: "Enter value",
          },
        },
        selectItems: {
          type: "array",
          label: {
            type: "input",
            label: "Label",
            placeholder: "Enter label",
          },
          value: {
            type: "input",
            label: "Value",
            placeholder: "Enter value",
          },
        },
        suffix: {
          type: "input",
          label: "Suffix",
          placeholder: "Enter suffix",
        },
        decimal: {
          type: "input",
          label: "Decimal",
          placeholder: "Enter decimal",
        },
        renderCondition: {
          type: "input",
          label: "Render Condition",
          placeholder: "Enter render condition",
        },
        caption: {
          type: "input",
          label: "Caption",
          placeholder: "Enter caption",
        },
      },
    },
  };
}

export function useUpdateFormSubtaskFormFields(): FormFieldsType<UpdateFormSubtaskFormInput> {
  const fields = useCreateFormSubtaskFormFields();
  return {
    ...fields,
    subtaskId: {
      type: "hidden",
    },
  };
}
