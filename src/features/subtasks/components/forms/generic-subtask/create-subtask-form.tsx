"use client";

import { Form } from "@/components/forms/form";
import { useCreateGenericSubtaskFormConfig } from "@/features/subtasks/components/forms/generic-subtask/create-subtask-form-config";

interface CreateGenericSubtaskFormProps {
  taskId: string;
  subtaskId: string;
}

export function CreateGenericSubtaskForm({
  taskId,
  subtaskId,
}: CreateGenericSubtaskFormProps) {
  const formConfig = useCreateGenericSubtaskFormConfig(taskId, subtaskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <></>
    </Form>
  );
}
