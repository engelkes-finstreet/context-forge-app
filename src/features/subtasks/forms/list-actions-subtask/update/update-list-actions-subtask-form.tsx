"use client";

import { CreateListActionsSubtaskFormFieldsProps } from "@/features/subtasks/forms/list-actions-subtask/use-list-actions-subtask-form-fields";
import { Subtask } from "@prisma/client";
import { useUpdateListActionsSubtaskFormConfig } from "@/features/subtasks/forms/list-actions-subtask/update/update-list-actions-subtask-form-config";
import { Form } from "@/components/forms/form";
import { ListActionsSubtaskFormFields } from "@/features/subtasks/forms/list-actions-subtask/list-actions-subtask-form-fields";

type Props = {
  subtask: Subtask;
} & CreateListActionsSubtaskFormFieldsProps;

export const UpdateListActionsSubtaskForm = ({
  subtask,
  swaggerPathOptions,
  nameOptions,
}: Props) => {
  const formConfig = useUpdateListActionsSubtaskFormConfig({
    subtask,
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
