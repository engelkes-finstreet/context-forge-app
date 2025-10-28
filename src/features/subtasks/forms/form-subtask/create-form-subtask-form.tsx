"use client";

import { useCreateFormSubtaskFormConfig } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-config";
import { Form } from "@/components/forms/form";
import { CreateFormSubtaskFormFields } from "@/features/subtasks/forms/form-subtask/create-form-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreateFormSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateFormSubtaskFormConfig({ taskId });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <CreateFormSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
