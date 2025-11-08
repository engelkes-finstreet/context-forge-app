import { SelectOptions } from "@/components/forms/dynamic-form-field/types";
import { FormFieldsType } from "@/components/forms/types";
import {
  CreateListActionsSubtaskFormInput,
  UpdateListActionsSubtaskFormInput,
} from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-schema";

export type CreateListActionsSubtaskFormFieldsProps = {
  swaggerPathOptions: SelectOptions;
  nameOptions: SelectOptions;
};

export function useCreateListActionsSubtaskFormFields({
  swaggerPathOptions,
  nameOptions,
}: CreateListActionsSubtaskFormFieldsProps): FormFieldsType<CreateListActionsSubtaskFormInput> {
  return {
    taskId: {
      type: "hidden",
    },
    listActionsName: {
      type: "input",
      label: "List Actions Name",
      placeholder: "Enter list actions name",
    },
    metadata: {
      pagePath: {
        type: "input",
        label: "Page Path",
        placeholder: "Enter page path",
      },
      withSearch: {
        type: "checkbox",
        label: "With Search",
      },
      withSort: {
        type: "checkbox",
        label: "With Sort",
      },
      withGrouping: {
        type: "checkbox",
        label: "With Grouping",
      },
      interactiveLists: {
        type: "array",
        swaggerPath: {
          type: "select",
          label: "Swagger Path",
          placeholder: "Enter swagger path",
          options: swaggerPathOptions,
        },
        name: {
          type: "select",
          label: "Name",
          placeholder: "Select name",
          options: nameOptions,
        },
      },
    },
  };
}

export function useUpdateListActionsSubtaskFormFields({
  swaggerPathOptions,
  nameOptions,
}: CreateListActionsSubtaskFormFieldsProps): FormFieldsType<UpdateListActionsSubtaskFormInput> {
  return {
    ...useCreateListActionsSubtaskFormFields({
      swaggerPathOptions,
      nameOptions,
    }),
    subtaskId: {
      type: "hidden",
    },
  };
}
