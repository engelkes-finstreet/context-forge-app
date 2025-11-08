"use client";

import { Form } from "@/components/forms/form";
import { ListActionsSubtaskFormFields } from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-fields";
import { CreateListActionsSubtaskFormFieldsProps } from "@/features/subtasks/forms/list-actions-subtask/use-list-actions-subtask-form-fields";
import { useCreateListActionsSubtaskFormConfig } from "@/features/subtasks/forms/list-actions-subtask/create/create-list-actions-subtask-form-config";

type Props = {
  taskId: string;
} & CreateListActionsSubtaskFormFieldsProps;

export const CreateListActionsSubtaskForm = ({
  taskId,
  swaggerPathOptions,
  nameOptions,
}: Props) => {
  const formConfig = useCreateListActionsSubtaskFormConfig({
    taskId,
    swaggerPathOptions,
    nameOptions,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <ListActionsSubtaskFormFields fieldNames={fieldNames} />
    </Form>
  );
};
