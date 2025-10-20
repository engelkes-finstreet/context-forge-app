'use client';

import { Form } from '@/components/forms/form';
import { useCreateSubtaskFormConfig } from '@/features/subtasks/components/forms/create-subtask/create-subtask-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

interface CreateSubtaskFormProps {
  taskId: string;
}

export function CreateSubtaskForm({ taskId }: CreateSubtaskFormProps) {
  const formConfig = useCreateSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.taskId} />
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.content} />
      </div>
    </Form>
  );
}
