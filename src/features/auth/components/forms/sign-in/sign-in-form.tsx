"use client";

import { useSignInFormConfig } from "@/features/auth/components/forms/sign-in/sign-in-form-config";
import { DynamicFormField } from "@/components/forms/dynamic-form-field/dynamic-form-field";
import { ClientForm } from "@/components/forms/client-form";

export function SignInForm() {
  const formConfig = useSignInFormConfig();
  const { fieldNames } = formConfig;

  return (
    <ClientForm formConfig={formConfig}>
      <div className="space-y-6">
        <DynamicFormField fieldName={fieldNames.email} />
        <DynamicFormField fieldName={fieldNames.password} />
      </div>
    </ClientForm>
  );
}
