'use client';

import { Form } from '@/components/forms/form';
import { useSignInFormConfig } from '@/features/auth/components/forms/sign-in/sign-in-form-config';
import { DynamicFormField } from '@/components/forms/dynamic-form-field/dynamic-form-field';

export function SignInForm() {
  const formConfig = useSignInFormConfig();
  const { fieldNames } = formConfig;

  return (
    <Form formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.email} />
        <DynamicFormField fieldName={fieldNames.password} />
      </div>
    </Form>
  );
}
