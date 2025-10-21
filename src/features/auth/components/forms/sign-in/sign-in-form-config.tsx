import { z } from 'zod';
import {
  FormConfig,
  FormFieldsType,
  FormState,
} from '@/components/forms/types';
import { DeepPartial } from 'react-hook-form';
import { toast } from 'sonner';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { signInFormAction } from '@/features/auth/components/forms/sign-in/sign-in-form-action';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signInFormId = 'sign-in-form';

export type SignInType = z.infer<typeof signInSchema>;
export type SignInFormState = FormState;

export function useSignInFormConfig(): FormConfig<SignInFormState, SignInType> {
  const router = useRouter();

  const defaultValues: DeepPartial<SignInType> = {
    email: '',
    password: '',
  };

  const fields: FormFieldsType<SignInType> = {
    email: {
      type: 'input',
      inputType: 'email',
      label: 'Email',
      placeholder: 'john@example.com',
    },
    password: {
      type: 'password',
      label: 'Password',
      placeholder: '********',
    },
  };

  return {
    fields,
    defaultValues,
    schema: signInSchema,
    fieldNames: createFormFieldNames(fields),
    serverAction: signInFormAction,
    hideActions: true,
    formId: signInFormId,
    useErrorAction: () => {
      return (state: SignInFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: SignInFormState) => {
        toast.success(state?.message || 'Signed in successfully');
        router.push(routes.home.path());
      };
    },
    renderFormActions: (isPending: boolean) => {
      return (
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          form={signInFormId}
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      );
    },
  };
}
