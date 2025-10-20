import { signUpFormAction } from '@/features/auth/components/forms/sign-up/sign-up-form-action';
import {
  FormConfig,
  FormFieldsType,
  FormState,
} from '@/components/forms/types';
import { createFormFieldNames } from '@/components/forms/utils/create-form-field-names';
import { Button } from '@/components/ui/button';
import { DeepPartial } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

const signUpFormId = 'sign-up-form';

export type SignUpType = z.infer<typeof signUpSchema>;
export type SignUpFormState = FormState;

export function useSignUpFormConfig(): FormConfig<SignUpFormState, SignUpType> {
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
    serverAction: signUpFormAction,
    formId: signUpFormId,
    hideActions: true,
    useErrorAction: () => {
      return (state: SignUpFormState) => {
        toast.error(state?.error || 'Something went wrong. Please try again.');
      };
    },
    useSuccessAction: () => {
      return (state: SignUpFormState) => {
        toast.success(state?.message || 'Account created successfully');
      };
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
