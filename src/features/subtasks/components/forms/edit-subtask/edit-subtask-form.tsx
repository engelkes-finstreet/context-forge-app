'use client';

import { Form } from '@/components/forms/form';
import { useEditSubtaskFormConfig } from '@/features/subtasks/components/forms/edit-subtask/edit-subtask-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

interface EditSubtaskFormProps {
  subtaskId: string;
  taskId: string;
  projectId: string;
  defaultValues: {
    name: string;
    content: string;
  };
}

export function EditSubtaskForm({
  subtaskId,
  taskId,
  projectId,
  defaultValues,
}: EditSubtaskFormProps) {
  const formConfig = useEditSubtaskFormConfig({
    subtaskId,
    taskId,
    projectId,
    defaultValues,
  });
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.id} />
        <DynamicFormField fieldName={fieldNames.taskId} />
        <DynamicFormField fieldName={fieldNames.projectId} />
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.content} />
      </div>
    </Form>
  );
}
