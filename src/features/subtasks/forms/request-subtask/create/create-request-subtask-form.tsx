"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { Form } from "@/components/forms/form";
import { useCreateRequestSubtaskFormConfig } from "@/features/subtasks/forms/request-subtask/create/create-request-subtask-form-config";
import {
  RequestSubtaskFormFields,
  RequestsFields,
} from "@/features/subtasks/forms/request-subtask/request-subtask-form-fields";
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
