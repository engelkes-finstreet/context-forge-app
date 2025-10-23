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

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const signUpFormId = 'sign-up-form';

export type SignUpType = z.infer<typeof signUpSchema>;

export function useSignUpFormConfig(): ClientFormConfig<SignUpType> {
  const router = useRouter();

  const defaultValues: DeepPartial<SignUpType> = {
    email: '',
    password: '',
    name: '',
  };

  const fields: FormFieldsType<SignUpType> = {
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
    name: {
      type: 'input',
      label: 'Name',
      placeholder: 'John Doe',
    },
  };

  return {
    fields,
    defaultValues,
    schema: signUpSchema,
    fieldNames: createFormFieldNames(fields),
    hideActions: true,
    formId: signUpFormId,
    onSubmit: async (data) => {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      toast.success('Account created successfully');
      router.push(routes.home.path({}));
    },
    renderFormActions: (isPending: boolean) => {
      return (
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          form={signUpFormId}
        >
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      );
    },
  };
}
