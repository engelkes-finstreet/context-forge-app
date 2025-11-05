"use client";

import { Form } from "@/components/forms/form";
import { useUpdateModalSubtaskFormConfig } from "@/features/subtasks/forms/modal-subtask/update/update-modal-subtask-form-config";
import { Subtask } from "@prisma/client";
import { ModalSubtaskFormFields } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-fields";

type Props = {
  subtask: Subtask;
};

export const UpdateModalSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdateModalSubtaskFormConfig(subtask);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <ModalSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
