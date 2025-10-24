"use client";

import { useSignUpFormConfig } from "@/features/auth/components/forms/sign-up/sign-up-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { ClientForm } from "@/components/forms/client-form";

export function SignUpForm() {
  const formConfig = useSignUpFormConfig();
  const { fieldNames } = formConfig;

  return (
    <ClientForm formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.name} />
        <DynamicFormField fieldName={fieldNames.email} />
        <DynamicFormField fieldName={fieldNames.password} />
      </div>
    </ClientForm>
  );
}
