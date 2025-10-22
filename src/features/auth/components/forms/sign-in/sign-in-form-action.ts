"use server";

import {
  SignInFormState,
  SignInType,
} from '@/features/auth/components/forms/sign-in/sign-in-form-config';
import { authClient } from '@/lib/auth-client';

export async function signInFormAction(
  state: SignInFormState,
  { email, password }: SignInType
): Promise<SignInFormState> {
  try {
    await authClient.signIn.email({
      email,
      password,
    });

    return {
      error: null,
      message: 'Signed in successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'Something went wrong. Please try again.',
      message: null,
    };
  }
}
