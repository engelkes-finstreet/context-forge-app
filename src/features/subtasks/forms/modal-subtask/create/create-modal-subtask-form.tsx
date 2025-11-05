"use client";

import { Form } from "@/components/forms/form";
import { useCreateModalSubtaskFormConfig } from "@/features/subtasks/forms/modal-subtask/create/create-modal-subtask-form-config";
import { ModalSubtaskFormFields } from "@/features/subtasks/forms/modal-subtask/modal-subtask-form-fields";

type Props = {
  taskId: string;
};

export const CreateModalSubtaskForm = ({ taskId }: Props) => {
  const formConfig = useCreateModalSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <ModalSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
