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
  createGenericSubtaskAction,
  SubtaskFormState,
} from "@/lib/actions/subtask-actions";
import { FormConfig, FormFieldsType } from "@/components/forms/types";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";

const createSubtaskFormId = "create-generic-subtask-form";

/**
 * Form configuration for creating a Generic subtask
 *
 * Uses the form schema (CreateGenericSubtaskFormInput) which contains only
 * the fields the user inputs. The server action will add type and metadata.
 */
export function useCreateGenericSubtaskFormConfig(
  taskId: string,
  endpoints: SwaggerEndpoint[],
): FormConfig<SubtaskFormState, CreateGenericSubtaskFormInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateGenericSubtaskFormInput> = {
    taskId,
    name: "",
    content: "",
    endpoint: undefined,
    customFields: {},
  };

  const fields: FormFieldsType<CreateGenericSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    name: {
      type: "input",
      inputType: "text",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    content: {
      type: "textarea",
      label: "Content",
      placeholder: "Enter subtask content (supports Markdown)",
      description: "This content is specific to this subtask",
    },
    endpoint: {
      type: "swagger_endpoint_selector",
      label: "Endpoint",
      description: "Select the API endpoint for this request",
      placeholder: "Select endpoint...",
      emptyText: "No endpoints found",
      endpoints,
    },
  };

  return {
    fields,
    defaultValues,
    schema: createGenericSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createGenericSubtaskAction,
    formId: createSubtaskFormId,
    useErrorAction: () => {
      return (state: SubtaskFormState) => {
        toast.error(state?.error || "Something went wrong. Please try again.");
      };
    },
    useSuccessAction: () => {
      return (state: SubtaskFormState) => {
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
