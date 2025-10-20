'use client';

import { Form } from '@/components/forms/form';
import { useCreateGenericSubtaskFormConfig } from '@/features/subtasks/components/forms/generic-subtask/create-subtask-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

interface CreateGenericSubtaskFormProps {
  taskId: string;
}

/**
 * CreateGenericSubtaskForm Component
 *
 * Form for creating a generic subtask (standard subtask with name and content).
 * This is the form displayed after selecting "Generic" type in the type selector.
 */
export function CreateGenericSubtaskForm({ taskId }: CreateGenericSubtaskFormProps) {
  const formConfig = useCreateGenericSubtaskFormConfig(taskId);
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        {/* Hidden fields (taskId, type) are not rendered - only in config */}
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.content} />
      </div>
    </Form>
  );
}
