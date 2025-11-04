import { FormConfig, FormState } from "@/components/forms/types";
import { createFormFieldNames } from "@/components/forms/utils/create-form-field-names";
import { Button } from "@/components/ui/button";
import { updateRequestSubtaskFormAction } from "@/features/subtasks/forms/request-subtask/request-subtask-form-action";
import {
  UpdateRequestSubtaskFormInput,
  updateRequestSubtaskFormSchema,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";
import { useUpdateRequestSubtaskFormFields } from "@/features/subtasks/forms/request-subtask/use-request-subtask-form-fields";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { Subtask } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DeepPartial } from "react-hook-form";
import { Request } from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";

export function useUpdateRequestSubtaskFormConfig(
  subtask: Subtask,
  endpoints: SwaggerEndpoint[],
): FormConfig<FormState, UpdateRequestSubtaskFormInput> {
  const router = useRouter();
  const fields = useUpdateRequestSubtaskFormFields({ endpoints });

  console.log({ subtask });

  const defaultValues: DeepPartial<UpdateRequestSubtaskFormInput> = {
    subtaskId: subtask.id,
    subtaskName: subtask.name,
    taskId: subtask.taskId,
    requests: subtask.metadata
      ? (subtask.metadata as { requests: Array<Request & { httpMethod: string }> }).requests.map(
          (request) => ({
            endpoint: `${request.httpMethod}:${request.endpoint}`,
            requestType: request.requestType,
            paginated: request.paginated,
            protected: request.protected,
            resultSchema: request.resultSchema,
          }),
        )
      : [],
  };

  return {
    fields,
    defaultValues,
    schema: updateRequestSubtaskFormSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: updateRequestSubtaskFormAction,
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
            {isPending ? "Updating..." : "Update Subtask"}
          </Button>
        </div>
      );
    },
  };
}
