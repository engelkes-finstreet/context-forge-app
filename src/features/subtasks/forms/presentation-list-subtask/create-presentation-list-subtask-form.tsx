"use client";

import { useCreatePresentationListSubtaskFormConfig } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-config";
import { Form } from "@/components/forms/form";
import { CreatePresentationListSubtaskFormFields } from "@/features/subtasks/forms/presentation-list-subtask/create-presentation-list-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreatePresentationListSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreatePresentationListSubtaskFormConfig({ taskId });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <CreatePresentationListSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
