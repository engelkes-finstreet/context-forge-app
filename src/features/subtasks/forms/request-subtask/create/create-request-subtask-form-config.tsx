"use client";

import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import {
  CreateRequestSubtaskFormInput,
  createRequestSubtaskFormSchema,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { DeepPartial } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createRequestSubtaskFormAction } from "@/features/subtasks/forms/request-subtask/request-subtask-form-action";
import { useCreateRequestSubtaskFormFields } from "@/features/subtasks/forms/request-subtask/use-request-subtask-form-fields";

export function useCreateRequestSubtaskFormConfig(
  taskId: string,
  endpoints: SwaggerEndpoint[],
): FormConfig<FormState, CreateRequestSubtaskFormInput> {
  const router = useRouter();
  const fields = useCreateRequestSubtaskFormFields({ endpoints });

  const defaultValues: DeepPartial<CreateRequestSubtaskFormInput> = {
    taskId,
    subtaskName: "",
    metadata: {
      requests: [
        {
          endpoint: "",
          requestType: undefined,
          paginated: false,
          protected: false,
          resultSchema: false,
        },
      ],
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
