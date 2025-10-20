'use client';

import { Form } from '@/components/forms/form';
import { useCreateTaskFormConfig } from '@/features/tasks/components/forms/create-task/create-task-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

interface CreateTaskFormProps {
  projectId: string;
}

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
  const formConfig = useCreateTaskFormConfig(projectId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.projectId} />
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.sharedContext} />
      </div>
    </Form>
  );
}
