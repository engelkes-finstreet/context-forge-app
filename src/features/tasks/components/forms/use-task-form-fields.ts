import { FormFieldsType } from "@/components/forms/types";
import {
  CreateTaskInput,
  UpdateTaskInput,
} from "@/features/tasks/components/forms/task-form-schema";

export function useTaskFormFields(): FormFieldsType<CreateTaskInput> {
  return {
    projectId: {
      type: "hidden",
    },
    name: {
      type: "input",
      inputType: "text",
      label: "Task Name",
      placeholder: "Enter task name",
    },
    featureName: {
      type: "input",
      inputType: "text",
      label: "Feature Name",
      placeholder: "Enter feature name",
    },
    product: {
      type: "select",
      label: "Product",
      placeholder: "Enter product",
      options: [
        { label: "Hoa Loan", value: "hoa-loan" },
        { label: "Hoa Account", value: "hoa-account" },
      ],
    },
    role: {
      type: "select",
      label: "Role",
      placeholder: "Enter role",
      options: [
        { label: "PM (Property Manager)", value: "pm" },
        { label: "FSP (Financial Service Provider)", value: "fsp" },
      ],
    },
  };
}

export function useUpdateTaskFormFields(): FormFieldsType<UpdateTaskInput> {
  return {
    ...useTaskFormFields(),
    taskId: {
      type: "hidden",
    },
  };
}
