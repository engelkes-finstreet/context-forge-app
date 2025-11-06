"use client";

import { Form } from "@/components/forms/form";
import { useCreateInteractiveListSubtaskFormConfig } from "@/features/subtasks/forms/interactive-list-subtask/create/create-interactive-list-subtask-form-config";
import { InteractiveListSubtaskFormFields } from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreateInteractiveListSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateInteractiveListSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <InteractiveListSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
