"use client";

import { Form } from "@/components/forms/form";
import { useUpdateRequestSubtaskFormConfig } from "@/features/subtasks/forms/request-subtask/update/update-request-subtask-form-config";
import { SwaggerEndpoint } from "@/lib/services/swagger-service";
import { Subtask } from "@prisma/client";
import { RequestSubtaskFormFields } from "@/features/subtasks/forms/request-subtask/request-subtask-form-fields";

type Props = {
  subtask: Subtask;
  endpoints: SwaggerEndpoint[];
};

export const UpdateRequestSubtaskForm = ({ subtask, endpoints }: Props) => {
  const formConfig = useUpdateRequestSubtaskFormConfig(subtask, endpoints);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <RequestSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
