import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { FormConfig, FormState } from "@/components/forms/types";
import {
  UpdateTaskInput,
  updateTaskSchema,
} from "@/features/tasks/components/forms/task-form-schema";
import { Task } from "@prisma/client";
import { useUpdateTaskFormFields } from "@/features/tasks/components/forms/use-task-form-fields";
import { updateTaskFormAction } from "@/features/tasks/components/forms/task-form-action";

interface UseEditTaskFormConfigProps {
  task: Task;
}

export function useEditTaskFormConfig({
  task,
}: UseEditTaskFormConfigProps): FormConfig<FormState, UpdateTaskInput> {
  const router = useRouter();
  const fields = useUpdateTaskFormFields();

  const defaultValues: DeepPartial<UpdateTaskInput> = {
    taskId: task.id,
    projectId: task.projectId,
    name: task.name,
    featureName: task.featureName,
    product: task.product ?? undefined,
    role: task.role ?? undefined,
  };

  return {
    fields,
    defaultValues,
    schema: updateTaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateTaskFormAction,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      );
    },
  };
}
