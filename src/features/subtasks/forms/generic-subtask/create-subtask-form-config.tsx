import { DeepPartial } from "react-hook-form";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import {
  createGenericSubtaskFormSchema,
  CreateGenericSubtaskFormInput,
} from "./create-generic-subtask-form-schema";
import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createGenericSubtaskFormAction } from "@/features/subtasks/forms/generic-subtask/create-generic-subtask-form-action";

const createSubtaskFormId = "create-generic-subtask-form";

/**
 * Form configuration for creating a Generic subtask
 *
 * Uses the form schema (CreateGenericSubtaskFormInput) which contains only
 * the fields the user inputs. The server action will add type and metadata.
 */
export function useCreateGenericSubtaskFormConfig(
  taskId: string,
): FormConfig<FormState, CreateGenericSubtaskFormInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateGenericSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    metadata: {
      context: "",
    },
  };

  const fields: FormFieldsType<CreateGenericSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    metadata: {
      context: {
        type: "markdown",
        label: "Content",
        placeholder: "Write your content using markdown...",
        description:
          "Supports GitHub Flavored Markdown (tables, code blocks, lists, etc.)",
        rows: 15,
      },
    },
  };

  return {
    fields,
    defaultValues,
    schema: createGenericSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createGenericSubtaskFormAction,
    formId: createSubtaskFormId,
    useErrorAction: () => {
      return (state: FormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
    useSuccessAction: () => {
      return (state: FormState) => {
        toast.success(state?.message || "Subtask created successfully");
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
          <Button type="submit" disabled={isPending} form={createSubtaskFormId}>
            {isPending ? "Creating..." : "Create Subtask"}
          </Button>
        </div>
      );
    },
  };
}
