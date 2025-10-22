"use server";

import {
  SignUpFormState,
  SignUpType,
} from '@/features/auth/components/forms/sign-up/sign-up-form-config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { typedRedirect, routes } from '@/lib/routes';

export async function signUpFormAction(
  state: SignUpFormState,
  { email, password, name }: SignUpType
): Promise<SignUpFormState> {
  try {
    console.log('[SignUp] Attempting to create user:', { email, name });

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    console.log('[SignUp] User created successfully:', { email, userId: result?.user?.id });

    if (!result || !result.user) {
      console.error('[SignUp] No user returned from auth.api.signUpEmail');
      return {
        error: 'Failed to create user account. Please try again.',
        message: null,
      };
    }
  } catch (error: any) {
    console.error('[SignUp] Error during sign up:', {
      message: error?.message,
      status: error?.status,
      body: error?.body,
      stack: error?.stack,
    });

    // Check for specific error types
    if (error?.status === 400) {
      return {
        error: 'Invalid email or password format.',
        message: null,
      };
    }

    if (error?.status === 409 || error?.message?.includes('already exists')) {
      return {
        error: 'An account with this email already exists.',
        message: null,
      };
    }

    return {
      error: error?.message || 'Something went wrong. Please try again.',
      message: null,
    };
  }

  typedRedirect(routes.home);
}
