"use client";

import { Form } from "@/components/forms/form";
import { useNewSubtaskFormConfig } from "@/features/subtasks/components/forms/new-subtask/new-subtask-form-config";
import { NewSubtaskFormFields } from "@/features/subtasks/components/forms/new-subtask/new-subtask-form-fields";

type Props = {
  taskId: string;
};

export const NewSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useNewSubtaskFormConfig({ taskId });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <NewSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
