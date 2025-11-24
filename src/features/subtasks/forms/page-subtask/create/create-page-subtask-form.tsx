"use client";

import { Form } from "@/components/forms/form";
import { useCreatePageSubtaskFormConfig } from "@/features/subtasks/forms/page-subtask/create/create-page-subtask-form-config";
import { PageSubtaskFormFields } from "@/features/subtasks/forms/page-subtask/page-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreatePageSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreatePageSubtaskFormConfig({ taskId });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <PageSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
