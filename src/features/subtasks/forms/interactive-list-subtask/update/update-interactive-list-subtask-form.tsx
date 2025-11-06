"use client";

import { Form } from "@/components/forms/form";
import { useUpdateInteractiveListSubtaskFormConfig } from "@/features/subtasks/forms/interactive-list-subtask/update/update-interactive-list-subtask-form-config";
import { InteractiveListSubtaskFormFields } from "@/features/subtasks/forms/interactive-list-subtask/interactive-list-subtask-form-fields";
import { Subtask } from "@prisma/client";

type Props = {
  subtask: Subtask;
};

export const UpdateInteractiveListSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdateInteractiveListSubtaskFormConfig(subtask);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <InteractiveListSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
