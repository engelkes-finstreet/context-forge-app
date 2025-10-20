'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSignUpFormConfig } from '@/features/auth/components/forms/sign-up/sign-up-form-config';
import { useFormIsPending } from '@/components/forms/form-state-store';
import { SignUpForm } from '@/features/auth/components/forms/sign-up/sign-up-form';

export function SignUpCard() {
  const formConfig = useSignUpFormConfig();
  const { data: formState } = useFormIsPending();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information to get started with FinStreet Estimation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        {formConfig.renderFormActions(formState.isPending)}
      </CardFooter>
    </Card>
  );
}
