"use client";

import { Form } from "@/components/forms/form";
import { useCreateGenericSubtaskFormConfig } from "@/features/subtasks/forms/generic-subtask/create-subtask-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";

interface CreateGenericSubtaskFormProps {
  taskId: string;
}

export function CreateGenericSubtaskForm({
  taskId,
}: CreateGenericSubtaskFormProps) {
  const formConfig = useCreateGenericSubtaskFormConfig(taskId);

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={formConfig.fieldNames.subtaskName} />
        <DynamicFormField fieldName={formConfig.fieldNames.metadata.context} />
      </div>
    </Form>
  );
}
