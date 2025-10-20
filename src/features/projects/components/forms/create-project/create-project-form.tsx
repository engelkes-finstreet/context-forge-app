'use client';

import { Form } from '@/components/forms/form';
import { useCreateProjectFormConfig } from '@/features/projects/components/forms/create-project/create-project-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

export function CreateProjectForm() {
  const formConfig = useCreateProjectFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.description} />
      </div>
    </Form>
  );
}
