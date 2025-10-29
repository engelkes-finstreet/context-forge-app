import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createFormSubtaskFormAction } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-action";
import { createFormSubtaskFormSchema } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-schema";
import { CreateFormSubtaskFormInput } from "@/features/subtasks/types/form-subtask-types";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";

type Props = {
  taskId: string;
};

export function useCreateFormSubtaskFormConfig({
  taskId,
}: Props): FormConfig<FormState, CreateFormSubtaskFormInput> {
  const router = useRouter();

  const defaultValues = {
    taskId,
    subtaskName: "",
    fields: [
      {
        fieldType: "input",
        name: "",
        label: "",
        description: "",
        options: [
          {
            name: "",
            label: "",
            sublabel: "",
          },
        ],
        radioItems: [
          {
            label: "",
            value: "",
          },
        ],
        selectItems: [
          {
            label: "",
            value: "",
          },
        ],
        multiSelect: false,
        inputType: "text",
        placeholder: "",
        validation: "",
      },
    ],
  };

  const fields: FormFieldsType<CreateFormSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
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
  };

  return {
    fields,
    defaultValues: defaultValues as any,
    schema: createFormSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createFormSubtaskFormAction,
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
    mode: "onSubmit",
  };
}
