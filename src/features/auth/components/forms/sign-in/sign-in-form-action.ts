"use server";

import {
  SignInFormState,
  SignInType,
} from '@/features/auth/components/forms/sign-in/sign-in-form-config';
import { auth } from '@/lib/auth';

export async function signInFormAction(
  state: SignInFormState,
  { email, password }: SignInType
): Promise<SignInFormState> {
  try {
    console.log('[SignIn] Attempting to sign in user:', { email });

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    console.log('[SignIn] User signed in successfully:', { email, userId: result?.user?.id });

    if (!result || !result.user) {
      console.error('[SignIn] No user returned from auth.api.signInEmail');
      return {
        error: 'Invalid email or password.',
        message: null,
      };
    }

    return {
      error: null,
      message: 'Signed in successfully',
    };
  } catch (error: any) {
    console.error('[SignIn] Error during sign in:', {
      message: error?.message,
      status: error?.status,
      body: error?.body,
      stack: error?.stack,
    });

    // Check for specific error types
    if (error?.status === 401) {
      return {
        error: 'Invalid email or password.',
        message: null,
      };
    }

    if (error?.status === 400) {
      return {
        error: 'Invalid email or password format.',
        message: null,
      };
    }

    return {
      error: error?.message || 'Something went wrong. Please try again.',
      message: null,
    };
  }
}
