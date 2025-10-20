'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSignInFormConfig } from '@/features/auth/components/forms/sign-in/sign-in-form-config';
import { useFormIsPending } from '@/components/forms/form-state-store';
import { SignInForm } from '@/features/auth/components/forms/sign-in/sign-in-form';

export function SignInCard() {
  const formConfig = useSignInFormConfig();
  const { data: formState } = useFormIsPending();

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter>
        {formConfig.renderFormActions(formState.isPending)}
      </CardFooter>
    </Card>
  );
}
