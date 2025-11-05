"use client";

import { Form } from "@/components/forms/form";
import { useCreateRequestSubtaskFormConfig } from "@/features/subtasks/forms/request-subtask/create/create-request-subtask-form-config";
import { RequestSubtaskFormFields } from "@/features/subtasks/forms/request-subtask/request-subtask-form-fields";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";

type Props = {
  taskId: string;
  endpoints: SwaggerEndpoint[];
};

export const CreateRequestSubtaskForm = ({ taskId, endpoints }: Props) => {
  const formConfig = useCreateRequestSubtaskFormConfig(taskId, endpoints);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <RequestSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
