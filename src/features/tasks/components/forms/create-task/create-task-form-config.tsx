import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createTaskSchema, CreateTaskInput } from "./create-task-form-schema";
import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createTaskFormAction } from "@/features/tasks/components/forms/create-task/create-task-form-action";

const createTaskFormId = "create-task-form";

export function useCreateTaskFormConfig(
  projectId: string,
): FormConfig<FormState, CreateTaskInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateTaskInput> = {
    projectId,
    name: "",
    featureName: "",
    product: undefined,
    role: undefined,
  };

  const fields: FormFieldsType<CreateTaskInput> = {
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

  return {
    fields,
    defaultValues,
    schema: createTaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createTaskFormAction,
    formId: createTaskFormId,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
    useSuccessAction: () => {
      return (state: FormState) => {
        toast.success(state?.message || "Task created successfully");
      };
    },
    renderFormActions: (isPending: boolean) => {
      return (
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} form={createTaskFormId}>
            {isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      );
    },
  };
}
