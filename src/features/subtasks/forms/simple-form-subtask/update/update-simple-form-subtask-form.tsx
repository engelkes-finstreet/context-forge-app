"use client";

import { Form } from "@/components/forms/form";
import { useUpdateSimpleFormSubtaskFormConfig } from "@/features/subtasks/forms/simple-form-subtask/update/update-simple-form-subtask-form-config";
import { SelectOptions } from "@/components/forms/dynamic-form-field/types";
import { Subtask } from "@prisma/client";
import { SimpleFormSubtaskFormFields } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-fields";
import { SimpleFormSubtaskMetadata } from "@/features/subtasks/forms/simple-form-subtask/simple-form-subtask-form-schema";

type Props = {
  subtask: Subtask;
  swaggerPathOptions: SelectOptions;
};

export const UpdateSimpleFormSubtaskForm = ({
  subtask,
  swaggerPathOptions,
}: Props) => {
  const formConfig = useUpdateSimpleFormSubtaskFormConfig({
    subtaskId: subtask.id,
    taskId: subtask.taskId,
    swaggerPathOptions,
    metadata: subtask.metadata as SimpleFormSubtaskMetadata,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <SimpleFormSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
