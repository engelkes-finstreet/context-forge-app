"use client";

import { Form } from "@/components/forms/form";
import { useCreateSimpleFormSubtaskFormConfig } from "@/features/subtasks/forms/simple-form-subtask/create/create-simple-form-subtask-form-config";
import { SimpleFormSubtaskFormFields } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-fields";
import { SelectOptions } from "@/components/forms/dynamic-form-field/types";

type Props = {
  taskId: string;
  swaggerPathOptions: SelectOptions;
};

export const CreateSimpleFormSubtaskForm = ({
  taskId,
  swaggerPathOptions,
}: Props) => {
  const formConfig = useCreateSimpleFormSubtaskFormConfig({
    taskId,
    swaggerPathOptions,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <SimpleFormSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
