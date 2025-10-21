import {
  SignUpFormState,
  SignUpType,
} from '@/features/auth/components/forms/sign-up/sign-up-form-config';
import { authClient } from '@/lib/auth-client';
import { typedRedirect, routes } from '@/lib/routes';

export async function signUpFormAction(
  state: SignUpFormState,
  { email, password, name }: SignUpType
): Promise<SignUpFormState> {
  try {
    await authClient.signUp.email({
      email,
      password,
      name,
    });
  } catch (error) {
    console.error(error);
    return {
      error: 'Something went wrong. Please try again.',
      message: null,
    };
  }

  typedRedirect(routes.home);
}
