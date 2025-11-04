"use client";

import { Form } from "@/components/forms/form";
import { useCreatePresentationListSubtaskFormConfig } from "@/features/subtasks/forms/presentation-list-subtask/create/create-presentation-list-subtask-form-config";
import { PresentationListSubtaskFormFields } from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreatePresentationListSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreatePresentationListSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <PresentationListSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
