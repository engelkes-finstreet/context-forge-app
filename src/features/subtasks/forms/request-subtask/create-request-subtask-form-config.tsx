"use client";

import {
  FormConfig,
  FormFieldsType,
  FormState,
} from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import {
  CreateRequestSubtaskFormInput,
  createRequestSubtaskFormSchema,
} from "@/features/subtasks/forms/request-subtask/create-request-subtask-form-schema";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createRequestSubtaskFormAction } from "@/features/subtasks/forms/request-subtask/create-request-subtask-form-action";

export function useCreateRequestSubtaskFormConfig(
  taskId: string,
  subtaskId: string,
  endpoints: SwaggerEndpoint[],
): FormConfig<FormState, CreateRequestSubtaskFormInput> {
  const router = useRouter();

  const defaultValues: DeepPartial<CreateRequestSubtaskFormInput> = {
    taskId,
    subtaskId,
    requests: [
      {
        endpoint: "",
        requestType: undefined,
        paginated: undefined,
        protected: undefined,
      },
    ],
  };

  const fields: FormFieldsType<CreateRequestSubtaskFormInput> = {
    taskId: {
      type: "hidden",
    },
    subtaskId: {
      type: "hidden",
    },
    requests: {
      type: "array",
      endpoint: {
        type: "swagger_endpoint_selector",
        label: "Endpoint",
        placeholder: "Select endpoint...",
        emptyText: "No endpoints found",
        endpoints,
      },
      requestType: {
        type: "select",
        label: "Request Type",
        placeholder: "Select request type...",
        options: [
          { label: "Server", value: "server" },
          { label: "Client", value: "client" },
        ],
      },
      paginated: {
        type: "checkbox",
        label: "Is this a paginated request?",
      },
      protected: {
        type: "checkbox",
        label: "Is this a protected request?",
      },
    },
  };

  return {
    fields,
    defaultValues,
    schema: createRequestSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: createRequestSubtaskFormAction,
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
