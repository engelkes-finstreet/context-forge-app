"use client";

import { Form } from "@/components/forms/form";
import { useUpdatePageSubtaskFormConfig } from "@/features/subtasks/forms/page-subtask/update/update-page-subtask-form-config";
import { Subtask } from "@prisma/client";
import { PageSubtaskFormFields } from "@/features/subtasks/forms/page-subtask/page-subtask-form-fields";
import { PageSubtaskMetadata } from "@/features/subtasks/forms/page-subtask/page-subtask-form-schema";

type Props = {
  subtask: Subtask;
};

export const UpdatePageSubtaskForm = ({ subtask }: Props) => {
  const formConfig = useUpdatePageSubtaskFormConfig({
    subtaskId: subtask.id,
    taskId: subtask.taskId,
    pageName: subtask.name,
    metadata: subtask.metadata as PageSubtaskMetadata,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <PageSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
