import { z } from 'zod';
import {
  ClientFormConfig,
  FormFieldsType,
} from '@/components/forms/types';
import { DeepPartial } from 'react-hook-form';
import { toast } from '@/lib/toast';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { authClient } from '@/lib/auth-client';

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signInFormId = 'sign-in-form';

export type SignInType = z.infer<typeof signInSchema>;

export function useSignInFormConfig(): ClientFormConfig<SignInType> {
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
    hideActions: true,
    formId: signInFormId,
    onSubmit: async (data) => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      toast.success('Signed in successfully');
      router.push(routes.home.path({}));
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
