import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { z } from "zod";
import { routes } from "@/lib/routes";
import {
  EditTaskInput,
  editTaskSchema,
} from "@/features/tasks/components/forms/edit-task/edit-task-form-schema";
import { editTaskFormAction } from "@/features/tasks/components/forms/edit-task/edit-task-form-action";

interface UseEditTaskFormConfigProps {
  taskId: string;
  projectId: string;
  defaultValues: {
    name: string;
    sharedContext: string;
  };
}

export function useEditTaskFormConfig({
  taskId,
  projectId,
  defaultValues: initialValues,
}: UseEditTaskFormConfigProps): FormConfig<FormState, EditTaskInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<EditTaskInput> = {
    id: taskId,
    projectId,
    name: initialValues.name,
    sharedContext: initialValues.sharedContext,
  };

  const fields: FormFieldsType<EditTaskInput> = {
    id: {
      type: "hidden",
    },
    projectId: {
      type: "hidden",
    },
    name: {
      type: "input",
      inputType: "text",
      label: "Task Name",
      placeholder: "Enter task name",
    },
    sharedContext: {
      type: "textarea",
      label: "Shared Context",
      placeholder: "Enter shared context for all subtasks (supports Markdown)",
      description:
        "This context will be accessible by all subtasks within this task",
    },
    order: {
      type: "hidden",
    },
  };

  return {
    fields,
    defaultValues,
    schema: editTaskSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: editTaskFormAction,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
    useSuccessAction: () => {
      return (state: FormState) => {
        toast.success(state?.message || "Task updated successfully");
        router.push(routes.projects.tasks.detail.path({ projectId, taskId }));
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
