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
            label: "",
            sublabel: "",
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
          { label: "Selectable Card", value: "selectable-card" },
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
      inputType: {
        type: "select",
        label: "Input Type",
        placeholder: "Select input type",
        options: [
          { label: "Text", value: "text" },
          { label: "Number", value: "number" },
        ],
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
  };
}
