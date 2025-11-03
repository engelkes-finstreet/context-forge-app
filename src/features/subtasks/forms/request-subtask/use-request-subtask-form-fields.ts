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
      resultSchema: {
        type: "checkbox",
        label: "Does this request return a result schema?",
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
