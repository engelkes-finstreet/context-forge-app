import { FormFieldsType } from "@/components/forms/types";
import {
  CreateRequestSubtaskFormInput,
  UpdateRequestSubtaskFormInput,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-schema";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";

type Props = {
  endpoints: SwaggerEndpoint[];
};

export function useCreateRequestSubtaskFormFields({
  endpoints,
}: Props): FormFieldsType<CreateRequestSubtaskFormInput> {
  return {
    taskId: {
      type: "hidden",
    },
    subtaskName: {
      type: "input",
      label: "Subtask Name",
      placeholder: "Enter subtask name",
    },
    metadata: {
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
          label: "Paginated",
        },
        protected: {
          type: "checkbox",
          label: "Protected",
        },
        resultSchema: {
          type: "checkbox",
          label: "Result Schema",
        },
      },
    },
  };
}

export function useUpdateRequestSubtaskFormFields({
  endpoints,
}: Props): FormFieldsType<UpdateRequestSubtaskFormInput> {
  const fields = useCreateRequestSubtaskFormFields({ endpoints });
  return {
    ...fields,
    subtaskId: {
      type: "hidden",
    },
  };
}
