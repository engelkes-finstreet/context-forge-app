import { SelectOptions } from "@/components/forms/dynamic-form-field/types";
import { FormFieldsType } from "@/components/forms/types";
import {
  CreateSimpleFormSubtaskFormInput,
  UpdateSimpleFormSubtaskFormInput,
} from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";

export type CreateSimpleFormSubtaskFormFieldsProps = {
  swaggerPathOptions: SelectOptions;
};

export function useCreateSimpleFormSubtaskFormFields({
  swaggerPathOptions,
}: CreateSimpleFormSubtaskFormFieldsProps): FormFieldsType<CreateSimpleFormSubtaskFormInput> {
  return {
    taskId: {
      type: "hidden",
    },
    metadata: {
      simpleFormName: {
        type: "input",
        label: "Simple Form Name",
        placeholder: "Enter simple form name",
      },
      swaggerPath: {
        type: "select",
        label: "Swagger Path",
        placeholder: "Select swagger path",
        options: swaggerPathOptions,
      },
      description: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter description",
      },
    },
  };
}

export function useUpdateSimpleFormSubtaskFormFields({
  swaggerPathOptions,
}: CreateSimpleFormSubtaskFormFieldsProps): FormFieldsType<UpdateSimpleFormSubtaskFormInput> {
  return {
    ...useCreateSimpleFormSubtaskFormFields({
      swaggerPathOptions,
    }),
    subtaskId: {
      type: "hidden",
    },
  };
}
