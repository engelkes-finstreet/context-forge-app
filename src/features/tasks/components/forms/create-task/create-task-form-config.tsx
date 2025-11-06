import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { createTaskSchema, CreateTaskInput } from "../task-form-schema";
import { FormConfig, FormState } from "@/components/forms/types";
import { useTaskFormFields } from "@/features/tasks/components/forms/use-task-form-fields";
import { createTaskFormAction } from "@/features/tasks/components/forms/task-form-action";

const createTaskFormId = "create-task-form";

export function useCreateTaskFormConfig(
  projectId: string,
): FormConfig<FormState, CreateTaskInput> {
  const router = useRouter();
  const fields = useTaskFormFields();

  const defaultValues: DeepPartial<CreateTaskInput> = {
    projectId,
    name: "",
    featureName: "",
    product: undefined,
    role: undefined,
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
