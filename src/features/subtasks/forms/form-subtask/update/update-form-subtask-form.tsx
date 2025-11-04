"use client";

import { Form } from "@/components/forms/form";
import { useUpdateFormSubtaskFormConfig } from "@/features/subtasks/forms/form-subtask/update/update-form-subtask-form-config";
import { FormSubtaskFormFields } from "@/features/subtasks/forms/form-subtask/form-subtask-form-fields";
import { Subtask } from "@prisma/client";

type Props = {
  subtask: Subtask;
};

export const UpdateFormSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdateFormSubtaskFormConfig(subtask);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <FormSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
