"use client";

import { Form } from "@/components/forms/form";
import { useUpdatePresentationListSubtaskFormConfig } from "@/features/subtasks/forms/presentation-list-subtask/update/update-presentation-list-subtask-form-config";
import { PresentationListSubtaskFormFields } from "@/features/subtasks/forms/presentation-list-subtask/presentation-list-subtask-form-fields";
import { Subtask } from "@prisma/client";

type Props = {
  subtask: Subtask;
};

export const UpdatePresentationListSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdatePresentationListSubtaskFormConfig(subtask);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <PresentationListSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
