"use client";

import { Form } from "@/components/forms/form";
import { useCreateFormSubtaskFormConfig } from "@/features/subtasks/forms/form-subtask/create/create-form-subtask-form-config";
import { FormSubtaskFormFields } from "@/features/subtasks/forms/form-subtask/form-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreateFormSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateFormSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <FormSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
