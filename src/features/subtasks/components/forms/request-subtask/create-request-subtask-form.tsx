"use client";

import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { Form } from "@/components/forms/form";
import { useCreateRequestSubtaskFormConfig } from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-config";
import {
  CreateRequestSubtaskFormFields,
  RequestsFields,
} from "@/features/subtasks/components/forms/request-subtask/create-request-subtask-form-fields";
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
      <CreateRequestSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
